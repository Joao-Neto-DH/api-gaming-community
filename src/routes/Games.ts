import { Express, Router } from "express";
import { PrismaClient } from "@prisma/client";

function GameRouters(express: Express){
    const route = Router({ caseSensitive: false });
    const prisma = new PrismaClient();
    
    // Retorna todos os jogos
    route.get("/", async (request, response)=> {
        const games = (await prisma.game.findMany({
            include: {
                screenshoots:{
                    take: 1,
                    select: {
                        image_path: true
                    },
                    where: {
                        cover: true
                    }
                }
            },
            skip: 0,
            take: 10
        }));
    
        response.status(200).send({
            "content-type": "text/json",
            "status": 200,
            "count": games.length,
            "page": 1,
            "datas": games.flatMap( game => ({
                "link": `/games/${game.id}`,
                ...game
            }) )
        });
    });
    
    // Retorna um único jogo representado pelo ID
    route.get("/:id", async (request, response)=> {
        const game = await prisma.game.findFirst({
            include: {
                screenshoots: {
                    take: 1,
                    select: {
                        image_path: true
                    },
                    where: {
                        cover: true
                    }
                }
            },
            where: {
                id: request.params.id
            }
        });
    
        if(game)
            return response.status(200).send({
                "content-type": "text/json",
                "status": 200,
                "game": game
            });
        
        response.status(404).send({
            "content-type": "text/json",
            "status": 404,
            "error_message": "Não foi encontrado nenhum jogo com esta identificação"
        });
    });

    route.delete("/:id/delete", async (request, response)=>{
        try {
            const game = await prisma.game.delete({
                where: {
                    id: request.params.id
                }
            });
    
            response.status(200).json({
                "status": 200,
                "message": "O jogo foi apagado com sucesso!",
                "game_deleted": game.title
            });
        } catch (error) {
            response.status(404).json({
                "status": 404,
                "message": "Não foi possível apagar o jogo porque o mesmo não existe",
                "game_id": request.params.id
            });
        }
    });

    return route;
}

export default GameRouters;
