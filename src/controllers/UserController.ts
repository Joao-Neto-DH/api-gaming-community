import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const createUser = async (request: Request, response: Response)=>{
    await tryCatchHandler(
        request, 
        response, 
        async ()=>{
            const body = request.body as User;
            console.log(body.password);
            
            body.password = await hidePassword(body.password);

            const user = await prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    gender: body.gender,
                    password: body.password
                },
                select: {
                    email: true,
                    name: true,
                    id: true
                }
            });

            response.status(201).send({
                "status": 201,
                "content-type": "text-json",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            });
        }, 
        "Email inválido", 
        "Já existe um usuário com este email"
    );
}

const loginUser = async (request: Request, response: Response)=>{
    await tryCatchHandler(
        request, 
        response, 
        async ()=>{
            const user = await prisma.user.findFirst({
                where: {
                    email: request.body.email
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    gender: true,
                    password: true
                }
            });

            if(user){
                const checked = await checkPassword(request.body.password, user.password);

                if (checked) {
                    const { id, name, email, gender } = user;
                    const token = jwt.sign({
                            "userId": user.id,
                            "email": user.email,
                            "name": user.name
                        }, process.env.JWT_SECRET || "vp9fS8L45Lljoa",
                        {
                            // algorithm: "HS256",
                            expiresIn: "1h"
                        }
                    );

                    return response.status(200).send({
                        "status": 200,
                        "content-type": "text-json",
                        "user": {
                            id,
                            name,
                            email,
                            gender
                        },
                        "token": token
                    });

                } else {
                    return response.status(412).send({
                        "status": 412,
                        "content-type": "text/json",
                        "user": {},
                        "message": "Credenciais inválidas"
                    });
                }
            }

            return response.status(412).send({
                "status": 412,
                "content-type": "text/json",
                "user": {},
                "message": "Credenciais inválidas"
            });
        }, 
        "Credenciais inválidas", 
        "Erro ao fazer o login"
    );
}

async function tryCatchHandler(request: Request, response: Response, callBackTableUser: ()=>void, errorMessage: string, errorDescription?: string) {
    try {
        await callBackTableUser();
    } catch (error) {        

        if(error instanceof PrismaClientKnownRequestError){

            if(error.code === "P1001"){
                return response.status(503).send({
                    "status": 503,
                    "error": error.code,
                    "error_message": "Falha na conexão com o Banco de Dados",
                });

            }else{
                return response.status(412).send({
                    "status": 412,
                    "error": error.code,
                    "error_message": errorMessage,
                    "error_description": errorDescription
                });
            }
        }

        return response.status(500).send({
            "status": 500,
            "error": "Erro desconhecido",
            "ss": error
        });
    }
}

async function hidePassword(password: string) {
    return await bcrypt.hash(password, 10);
}

async function checkPassword(userPassword: string,hashPassword:string) {
    return bcrypt.compare(userPassword, hashPassword)
}

export { createUser, loginUser }