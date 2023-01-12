import { PrismaClient, Comment } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createCommentByGame = async (request: Request, response: Response) => {
    try {
        const body = request.body as Comment;
        const comment = await prisma.comment.create({
            data: {
                description: body.description,
                userId: body.userId,
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
        response.status(412).send({
            "content-type": "text/json",
            "status": 412,
            "error": error
        });
    }
};

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

const deleCommentOfGame = async (request: Request, response: Response) => {
    try {
        const comment = await prisma.comment.delete({
            where: {
                id: request.params.commentId
            }
        });

        response.status(200).send({
            "status": 200,
            "content-type": "text/json",
            "comment_deleted": comment.description
        });
    } catch (error) {
        response.status(404).send({
            "status": 404,
            "content-type": "text/json",
            "error_message": "O comentário "+request.params.commentId+" não existe!"
        });
    }
}

export { createCommentByGame, getCommentsByGame, deleCommentOfGame }