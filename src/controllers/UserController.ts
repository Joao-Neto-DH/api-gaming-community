import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

const createUser = async (request: Request, response: Response)=>{
    await tryCatchHandler(request, response, async ()=>{
        
        const body = request.body as User;

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
    });
}

const loginUser = async (request: Request, response: Response)=>{
    response.send({
        login: await compare(request.body.password, request.body.hash)
    });
}

async function tryCatchHandler(request: Request, response: Response, callBackTableUser: ()=>void) {
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
                    "error_message": "Email inválido",
                    "error_description": "Já existe um usuário com este email"
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
    return await bcrypt.hash("amor", 10);
}

async function compare(userPassword: string,hashPassword:string) {
    return bcrypt.compare(userPassword, hashPassword)
}

export { createUser, loginUser }