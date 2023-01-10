import Express from "express";
import { PrismaClient } from "@prisma/client";

const app = Express();
const prisma = new PrismaClient();

// Jogos
app.get("/games", async (request, response)=> {
    let games = (await prisma.game.findMany({
        skip: 0,
        take: 10
    }));
        // console.log(games.flatMap( game => ({...game,"link":"j"})));

    response.status(200).send({
        "content-type": "text/json",
        "status": 200,
        "count": games.length,
        "page": 1,
        "datas": games.flatMap( game => ({...game,"link": `/games/${game.id}`}) )
    });
});

app.get("/games/:id", async (request, response)=> {
    const game = await prisma.game.findFirst({
        where: {
            id: request.params.id
        }
    });

    if(game)
        return response.status(200).send({
            "content-type": "text/json",
            "status": 200,
            "game": {...game, "link": `/games/${game.id}`}
        });
    
    response.status(404).send({
        "content-type": "text/json",
        "status": 404,
        "error_message": "Não foi encontrado nenhum jogo com esta identificação"
    });
});

// Comentários
app.post("/games/:id/comments", (request, response)=> {
    
});
app.get("/games/:gameId/comments/:commentId/responses", (request, response)=>{

});

app.listen(3024, ()=>{
    console.log("Online")
});