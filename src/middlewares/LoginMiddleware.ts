import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const checkToken = (request: Request, response: Response, next: NextFunction)=>{
    try {
        const user = jwt.verify(
            request.body.token, 
            process.env.JWT_SECRET || "vp9fS8L45Lljoa",
        );

        request.body.user = user;

        next();
    } catch (error) {
        return response.status(412).send({
            "status": 412,
            "content-type": "text/json",
            "error": "Token inválido",
            "error_message": "Falha na autenticação"
        });
    }
}

export { checkToken };