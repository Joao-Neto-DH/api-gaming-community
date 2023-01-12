import { Router } from "express";
import { Game, PrismaClient } from "@prisma/client";
import { isEmpty } from "../utils/strings";
import isNull from "../utils/isNull";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { host } from "../utils/host";

type bodyGame = Game & {
    type: string[]
}
type bodyGamePage = {
    page?: number
}

function GameRouters(){
    const route = Router({ caseSensitive: false });
    const prisma = new PrismaClient();

    // Cria um jogo
    route.post("/", async (request, response)=>{
        const bodyRequest = request.body as bodyGame;
        const { title, ageClassification, description, yearSold } = bodyRequest;
        const types = bodyRequest.type.map(t=>({type: t.trim()}));
        
        try {
            if(!types.length) throw new Error("O jogo deve ter pelo menos uma categoria/tipo");
            const game = await prisma.game.create({
                data: {
                    title,
                    ageClassification,
                    description,
                    yearSold,
                    genre: {
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
                "url": `${host(request)}/games/${game.id}`,
                "game": game
            });
        } catch (error) {
            let errMessage: string;
            
            if (error instanceof PrismaClientKnownRequestError) {
                errMessage = error.code;
            } else {
                errMessage = (error as Error).message;
            }
            
            response.status(403).json({
                "status": 403,
                "content-type": "text/json",
                "error_message": errMessage,
                "description": "Informações de jogo incorrentas! O jogo deve ter a "
                    +"seguinte estrutura:{title: string, ageClassification: string, "
                    +"description: string, yearSold: number,"
                    +"type: array}",
                "corrigir": "posterior"
            });        
        }
    });
    
    // Retorna todos os jogos
    route.get("/", async (request, response)=> {
        const body = request.body as bodyGamePage;
        const items = 10;
        
        const games = await prisma.game.findMany({
            skip: (body.page == undefined || body.page < 1) ? 0 : items * (body.page - 1 ),
            take: items,
            select: {
                id: true,
                title: true,
                yearSold: true,
                updatedAt: true,
                description: true,
                genre: {
                    select: {
                        type: true,
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },
            orderBy: {
                updatedAt: "asc"
            }            
        });
    
        const datas = games.map( game => {
            const { genre, ...rest } = game;
            const data = {
                "url": `${host(request)}/games/${game.id}`,
                ...rest,
                "genre": genre.map(genre=>genre.type)
            }
            return data;
        });

        response.status(200).send({
            "content-type": "text/json",
            "status": 200,
            "count": games.length,
            "page": body.page,
            "datas": datas
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
                genre: true,
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
    
        if(game){
            
            const { genre, ...rest } = game;
            const data = {
                "url": `${host(request)}/games/${game.id}`,
                ...rest,
                "genre": genre.map(genre=>genre.type)
            }

            return response.status(200).send({
                "content-type": "text/json",
                "status": 200,
                "game": data
            });
        }
        
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
