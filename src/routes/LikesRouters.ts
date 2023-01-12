import { GameLikes, PrismaClient } from "@prisma/client";
import { Router } from "express";

type Like = {
    userId: string,
    reaction: number
}

function LikesRouters() {
    const route = Router({ caseSensitive: false });
    const prisma = new PrismaClient();

    route.post("/:gameId/like", async (request, response)=>{
        const body = request.body as Like;

        if(body.reaction === 0){
            await prisma.gameLikes.deleteMany({
                where: {
                    AND: {
                        userId: body.userId,
                        gameId: request.params.gameId
                    }
                }
            });

            return response.status(200).send();
        }

        const exist = await prisma.gameLikes.findFirst({
            where: {
                gameId: request.params.gameId,
                userId: request.body.userId
            }
        });

        try {
            let reaction: GameLikes;

            if (exist) {
                reaction = await prisma.gameLikes.update({
                    data: {
                        like: body.reaction > 0 ? 1 : -1,
                        gameId: request.params.gameId,
                        userId: body.userId,
                        updatedAt: new Date()
                    },
                    where: {
                        id: exist.id
                    }
                });           
            } else {
                reaction = await prisma.gameLikes.create({
                    data: {
                        like: body.reaction > 0 ? 1 : -1,
                        gameId: request.params.gameId,
                        userId: body.userId
                    }
                });           
                
            }

            response.status(200).send({
                "status": 200,
                "content-type": "text/json",
                "data": {
                    "userId": body.userId,
                    "reation": reaction.like
                }
            });
        } catch (error) {
            response.status(400).send(error)
        }
    });

    return route;
}

export default LikesRouters;