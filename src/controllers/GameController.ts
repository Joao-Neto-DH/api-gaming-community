import { Game, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Request, Response } from "express";
import { host } from "../utils/host";

type bodyGame = Game & { type: string[] };
type bodyGamePage = { page?: number };

const prisma = new PrismaClient();

const createGame = async (request: Request, response: Response) => {
    const bodyRequest = request.body as bodyGame;
    const { title, ageClassification, description, yearSold } = bodyRequest;
    const types = bodyRequest.type.map(t=>({type: t.trim()})).filter(el=>el.type.length);
    
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
        
        response.status(412).json({
            "status": 412,
            "content-type": "text/json",
            "error_message": errMessage,
            "description": "Informações de jogo incorrentas! O jogo deve ter a "
                +"seguinte estrutura:{title: string, ageClassification: string, "
                +"description: string, yearSold: number,"
                +"type: array}"
        });        
    }
};

const getGames = async (request: Request, response: Response) => {
    const bodyGame = request.body as bodyGamePage;
    const items = 10;
    
    const games = await prisma.game.findMany({
        skip: (bodyGame.page === undefined || bodyGame.page < 1) ? 0 : items * (bodyGame.page - 1 ),
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
                    comments: true,
                    likes: true
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
            "comments_url": `${host(request)}/games/${game.id}/comments`,
            "like_url": `${host(request)}/games/${game.id}/like`,
            ...rest,
            "genre": genre.map(genre=>genre.type)
        }
        return data;
    });

    response.status(200).send({
        "content-type": "text/json",
        "status": 200,
        "count": games.length,
        "page": bodyGame.page,
        "datas": datas
    });
};

const getGame = async (request: Request, response: Response) => {
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
                    comments: true,
                    likes: true
                }
            }
        },
        where: {
            id: request.params.gameId
        }
    });

    if(game){
        
        const { genre, ...rest } = game;
        const data = {
            "url": `${host(request)}/games/${game.id}`,
            "comments_url": `${host(request)}/games/${game.id}/comments`,
            "like_url": `${host(request)}/games/${game.id}/like`,
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
        "error_message": "Não foi encontrado nenhum jogo com a identificação "+request.params.gameId
    });
};

const deleteGame = async (request: Request, response: Response)=>{
    try {
        const game = await prisma.game.delete({
            where: {
                id: request.params.gameId
            }
        });

        response.status(200).json({
            "status": 200,
            "message": "O jogo apagado com sucesso!",
            "game_deleted": game.title
        });
    } catch (error) {
        response.status(404).json({
            "status": 404,
            "error_message": "Não foi possível apagar o jogo porque o mesmo não existe!",
            "game_id": request.params.gameId
        });
    }
};

export { createGame, getGames, getGame, deleteGame }