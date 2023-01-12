import { PrismaClient, Comment } from "@prisma/client";
import Express from "express";

function CommentRouters() {
    const route = Express.Router({caseSensitive: false});
    const prisma = new PrismaClient();

    route.post("/:id/comments", async (request, response)=>{
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
    });

    // Recupera todos os comentários de um jogo
    route.get("/:id/comments", async (request, response)=>{
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
    });

    // Apagar comentário
    route.delete("/:gameId/comments/:commentId/delete", async (request, response)=>{
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
    });

    return route;
}

export default CommentRouters;