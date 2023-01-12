import { Router } from "express";
import { Game, PrismaClient } from "@prisma/client";
import { isEmpty } from "../utils/strings";
import isNull from "../utils/isNull";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

type body = Game & {
    type: string[]
}

function GameRouters(){
    const route = Router({ caseSensitive: false });
    const prisma = new PrismaClient();

    // Cria um jogo
    route.post("/", async (request, response)=>{
        const bodyRequest = request.body as body;
        
        // if(isValidGame(bodyRequest)){
            const { title, ageClassification, description, yearSold } = bodyRequest;
            const types = bodyRequest.type.map(t=>({type: t}));
            
            try {
                const game = await prisma.game.create({
                    data: {
                        title,
                        ageClassification,
                        description,
                        yearSold,
                        genders: {
                            createMany: {
                                skipDuplicates: true,
                                data: types
                            }
                        }
                    }
                });
                
                response.status(201).json({
                    "status": 201,
                    "content-type": "text/json",
                    "message": "Jogo criado com sucesso",
                    "game": game
                });
            } catch (error) {
                const err = error as PrismaClientKnownRequestError;
                const meta = err.meta;   
                
                response.status(403).json({
                    "status": 403,
                    "content-type": "text/json",
                    "message": "Informações de jogo incorrentas! O jogo deve ter a "
                        +"seguinte estrutura:{title: string, ageClassification: string, "
                        +"description: string, yearSold: number,"
                        +"type: array}",
                    "erro": meta,
                    "corrigir": "posterior"
                });        
            }
        // }else{
        // }
    });
    
    // Retorna todos os jogos
    route.get("/", async (request, response)=> {
        const games = (await prisma.game.findMany({
            skip: 0,
            take: 10,
            select: {
                id: true,
                title: true,
                yearSold: true,
                updatedAt: true,
                description: true,
                genders: {
                    select: {
                        type: true,
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
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
            select:{
                id: true,
                title: true,
                yearSold: true,
                updatedAt: true,
                description: true,
                _count: {
                    select: {
                        comments: true
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
            "error_message": "Não foi encontrado nenhum jogo com esta identificação "+request.params.id
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
    const empty = isNull(game) ||
                  isEmpty(game.title) || 
                  isEmpty(game.ageClassification) ||
                  isEmpty(game.description) ||
                  !Number.isInteger(game.yearSold) ||
                  isEmpty(game.type);
            
    return true;
}


export default GameRouters;
