import { Router } from "express";
import { Game, PrismaClient } from "@prisma/client";
import { isEmpty } from "../utils/strings";

function GameRouters(){
    const route = Router({ caseSensitive: false });
    const prisma = new PrismaClient();

    // Cria um jogo
    route.post("/", async (request, response)=>{
        console.log(request.headers)
        const game = request.body;
        if(isValidGame(game))
            return response.status(201).json({
                "status": 201,
                "content-type": "text/json",
                "message": "Jogo criado com sucesso",
                "game": game
            });
        else
            return response.json({
                "status": 100,
                "content-type": "text/json",
                "message": "Informações de jogo incorrentas! O jogo deve ter a seguinte estrutura:\n{title: string, \nageClassification: string, \ndescription: string, yearSell: number}"
        });
        // try {
        //     console.log(game);
            
            
        //     if(isValidGame(game)){
        //        return response.status(201).json({
        //             "status": 201,
        //             "content-type": "text/json",
        //             "message": "Jogo criado com sucesso",
        //             "game": game
        //         });
        //     }else{
        //         return response.status(100).json({
        //             "status": 100,
        //             "content-type": "text/json",
        //             "message": "Informações de jogo incorrentas! O jogo deve ter a seguinte estrutura:\n"+
        //                         "{title: string, \nageClassification: string, \ndescription: string, yearSell: number}"
        //         });
        //     }
        // } catch (error) {            
        //    return response.status(100).json({
        //         "status": 100,
        //         "content-type": "text/json",
        //         "message": "Informações de jogo incorrentas! O jogo deve ter a seguinte estrutura:\n"+
        //                     "{title: string, \nageClassification: string, \ndescription: string, yearSell: number}"
        //     });
        // }
        
    });
    
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

    // Apaga um jogo
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

// Valida jogo
function isValidGame(game: any) {
    return true;
    const empty = game == undefined ||
                  game == null ||
                  isEmpty(game.title) || 
                  isEmpty(game.ageClassification) ||
                  isEmpty(game.description) //|| 
                //   game.yearSold < 1990;
    return !empty;
}


export default GameRouters;
