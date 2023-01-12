import { Router } from "express";
import { reationGame } from "../controllers/LikesController";

function LikesRouters() {
    const route = Router({ caseSensitive: false });

    route.post("/:gameId/like", reationGame);

    return route;
}

export default LikesRouters;