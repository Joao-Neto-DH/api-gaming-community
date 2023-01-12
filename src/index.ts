import Express from "express";
import { PrismaClient } from "@prisma/client";
import { urlencoded } from "body-parser"; 
import { config } from "dotenv";
import GameRouters from "./routes/Games";

const app = Express();
app.use(urlencoded({extended: false, type: "text/json"}));
const dotenv = config({ path: "./.env" });
if(dotenv.error) console.error(dotenv.error?.stack);

const prisma = new PrismaClient();

// Jogos
app.use("/games", GameRouters());
// app.get("/games", async (request, response)=> {
//     const games = (await prisma.game.findMany({
//         include: {
//             screenshoots:{
//                 take: 1,
//                 select: {
//                     image_path: true
//                 },
//                 where: {
//                     cover: true
//                 }
//             }
//         },
//         skip: 0,
//         take: 10
//     }));

//     response.status(200).json({
//         "content-type": "text/json",
//         "status": 200,
//         "count": games.length,
//         "page": 1,
//         "datas": games.flatMap( game => ({
//             "link": `/games/${game.id}`,
//             ...game
//         }) )
//     });
// });

// app.get("/games/:id", async (request, response)=> {
//     const game = await prisma.game.findFirst({
//         include: {
//             screenshoots: {
//                 take: 1,
//                 select: {
//                     image_path: true
//                 },
//                 where: {
//                     cover: true
//                 }
//             }
//         },
//         where: {
//             id: request.params.id
//         }
//     });

//     if(game)
//         return response.status(200).json({
//             "content-type": "text/json",
//             "status": 200,
//             "game": game
//         });
    
//     response.status(404).send({
//         "content-type": "text/json",
//         "status": 404,
//         "error_message": "Não foi encontrado nenhum jogo com esta identificação"
//     });
// });

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
    // const comments = await prisma.comment.findMany({
    //     where: {
    //         gameId: request.params.id
    //     }
    // });

    // response.status(200).send({
    //     "content-type": "text/json",
    //     "status": 200,
    //     "game_link": `/games/${request.params.id}`,
    //     "count": comments.length,
    //     "comments": comments
    // });
});
app.get("/games/:gameId/comments/:commentId/responses", (request, response)=>{

});

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor online⚡\nAcesse: http://localhost:${process.env.PORT}/games`)
});