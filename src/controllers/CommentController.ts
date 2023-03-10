import { PrismaClient, Comment } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * 
 * POST: Body request type
 * {
 *      description: string
 * }
 * 
 * Response type comment created
 * {
 *      content-type: string,
 *      status: number,
 *      comment: {
 *          description: string;
 *          User: {
 *              name: string;
 *          }
 *      }
 *  }
 */
const createCommentByGame = async (request: Request, response: Response) => {
    try {
        if(!request.body.description.trim().length) throw new PrismaClientKnownRequestError("Descrição não pode estar vazia", {code: "CA002", clientVersion: "4.1.2"});
        
        const body = request.body as Comment;
        const comment = await prisma.comment.create({
            data: {
                description: body.description.trim(),
                userId: request.body.user.userId,
                gameId: request.params.id,
            },
            select: {
                description: true,
                User: {
                    select: {
                        name: true
                    }
                }
            }
        });

        response.status(200).send({
            "content-type": "text/json",
            "status": 200,
            "comment": comment
        });
    } catch (error) {

        if(error instanceof PrismaClientKnownRequestError){

            if(error.code === "P1001"){
                return response.status(503).send({
                    "status": 503,
                    "error": error.code,
                    "error_message": "Falha na conexão com o Banco de Dados",
                });
            }else{
                return response.status(412).json({
                    "status": 412,
                    "error": error.code,
                    "error_message": error.message
                });  
            }
        }

        return response.status(500).send({
            "status": 500,
            "error": "Erro desconhecido"
        });
    }
};

/**
 * GET: Body request type
 * {}
 * 
 * Response type
 * {
 *      content-type: string,
 *      status: number,
 *      datas: {
 *              comments:[
 *                          {
 *                              id: string;
 *                              description: string;
 *                              updatedAt: Date;
 *                              User: {
 *                                  name: string;
 *                          }
 *                      ],
 *              _count: {
 *                  comments: number;
 *          }
 *      }
 *  }
 */
const getCommentsByGame = async (request: Request, response: Response) => {
    try {
        const comments = await prisma.game.findMany({
            select: {
                _count: {
                    select: {
                        comments: true
                    }
            },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        updatedAt: true,
                        User: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            where: {
                id: request.params.id
            }
        });

        response.status(200).send({
            "content-type": "text/json",
            "status": 200,
            "datas": comments
        });
    } catch (error) {
        response.status(404).send({
            "content-type": "text/json",
            "status": 404,
            "error": error
        });
    }
};

/**
 * GET: Body request type
 * {}
 * 
 * Response type
 * {
 *      content-type: string,
 *      status: number,
 *      comment_deleted: number
 *  }
 */
const deleCommentOfGame = async (request: Request, response: Response) => {
    try {
        const comment = await prisma.comment.deleteMany({
            where: {
                AND: {
                    userId: request.body.user.userId,
                    id: request.params.commentId
                }
            },
        });

        response.status(200).send({
            "status": 200,
            "content-type": "text/json",
            "comment_deleted": comment.count
        });
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){

            if(error.code === "P1001"){
                return response.status(503).send({
                    "status": 503,
                    "error": error.code,
                    "error_message": "Falha na conexão com o Banco de Dados",
                });
            }else{
                return response.status(404).send({
                    "status": 404,
                    "error": error.code,
                    "error_message": "O comentário "+request.params.commentId+" não existe!"
                }); 
            }
        }

        return response.status(500).send({
            "status": 500,
            "error": "Erro desconhecido"
        });
    }
}

export { createCommentByGame, getCommentsByGame, deleCommentOfGame }