import { Router } from "express";
import { createCommentByGame , deleCommentOfGame, getCommentsByGame } from "../controllers/CommentController";

function CommentRouters() {
    const route = Router({caseSensitive: false});

    // Cria comentário para um jogo
    route.post("/:id/comments", createCommentByGame);

    // Recupera todos os comentários de um jogo
    route.get("/:id/comments", getCommentsByGame);

    // Apagar comentário de um jogo
    route.delete("/:gameId/comments/:commentId/delete", deleCommentOfGame);

    return route;
}

export default CommentRouters;