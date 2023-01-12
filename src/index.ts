import Express from "express";
import { PrismaClient } from "@prisma/client";
import { json, urlencoded } from "body-parser"; 
import { config } from "dotenv";
import GameRouters from "./routes/GameRouters";

const app = Express();
app.use(json({type: "application/json"}));
const dotenv = config({ path: "./.env" });
if(dotenv.error) console.error(dotenv.error?.stack);

const prisma = new PrismaClient();

// Jogos
app.use("/games", GameRouters());

// Comentários
app.get("/games/:id/comments", async (request, response)=> {
    const comments = await prisma.comment.findMany({
        where: {
            gameId: request.params.id
        }
    });

    response.status(200).send({
        "content-type": "text/json",
        "status": 200,
        "game_link": `/games/${request.params.id}`,
        "count": comments.length,
        "datas": comments
    });
});

app.post("/games/:id/comments", async (request, response)=> {
    response.send({
        text: "criação de comentário"
    });
});
app.get("/games/:gameId/comments/:commentId/responses", (request, response)=>{
    response.send({
        text: "retorna todas as respostas de um comentário"
    });
});

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor online⚡\nAcesse: http://localhost:${process.env.PORT}/games`)
});