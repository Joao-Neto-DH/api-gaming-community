import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

/**
 * User not authenticated response type
 * {
 *      status: number,
 *      content-type: string,
 *      error: string,
 *      error_message: string
 *  }
 *
 */
const checkToken = (request: Request, response: Response, next: NextFunction)=>{    
    try {
        const user = jwt.verify(
            request.headers.authorization?.split(" ")[1] || "", 
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