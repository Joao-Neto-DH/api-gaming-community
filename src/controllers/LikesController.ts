import { PrismaClient, GameLikes } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Response, Request } from "express";

type Like = {
    reaction: number
}

const prisma = new PrismaClient();

const reationGame = async (request: Request, response: Response)=>{
    
    try {
        const body = request.body as Like;
    
        if(body.reaction === 0){
            await prisma.gameLikes.deleteMany({
                where: {
                    AND: {
                        userId: request.body.user.userId,
                        gameId: request.params.gameId
                    }
                }
            });
    
            return response.status(204).send();
        }
    
        const exist = await prisma.gameLikes.findFirst({
            where: {
                gameId: request.params.gameId,
                userId: request.body.user.userId
            },
            select: {
                id: true
            }
        });

        let reaction: GameLikes;

        if (exist) {
            reaction = await prisma.gameLikes.update({
                data: {
                    like: body.reaction > 0 ? 1 : -1,
                    gameId: request.params.gameId,
                    userId: request.body.user.userId,
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
                    userId: request.body.user.userId
                }
            });
        }

        return response.status(200).send({
            "status": 200,
            "content-type": "text/json",
            "data": {
                "userId": request.body.user.userId,
                "reation": reaction.like
            }
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
                return response.status(412).send({
                    "status": 412,
                    "error": error.code,
                    "error_message": "Permissão negada",
                    "error_description": "Requesitos insuficientes"
                });
            }
        }

        return response.status(500).send({
            "status": 500,
            "error": "Erro desconhecido"
        });
    }
};

export { reationGame };