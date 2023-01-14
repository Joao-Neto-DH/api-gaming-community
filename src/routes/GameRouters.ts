import { Router } from "express";
import { createGame, deleteGame, getGame, getGames } from "../controllers/GameController";
import { checkToken } from "../middlewares/LoginMiddleware";

function GameRouters(){
    const route = Router({ caseSensitive: false });

    // Cria um jogo
    route.post("/", createGame);

    // Retorna todos os jogos
    route.get("/", checkToken, getGames);
    
    // Retorna um único jogo representado pelo ID
    route.get("/:gameId", getGame);

    // Apaga um jogo
    route.delete("/:gameId/delete", deleteGame);

    return route;
}

export default GameRouters;
