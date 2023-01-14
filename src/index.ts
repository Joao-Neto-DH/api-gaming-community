import Express from "express";
import { json } from "body-parser"; 
import { config } from "dotenv";
import GameRouters from "./routes/GameRouters";
import CommentRouters from "./routes/CommentRouters";
import LikesRouters from "./routes/LikesRouters";
import cors from "cors";
import UserRouters from "./routes/UserRouters";
import { checkToken } from "./middlewares/LoginMiddleware";

const app = Express();
app.use(cors());
app.use(json({type: "application/json"}));

const dotenv = config({ path: "./.env" });
if(dotenv.error) console.error(dotenv.error?.stack);


// Jogos
app.use("/games", GameRouters());

// Comentários
app.use("/games", CommentRouters());

// Reacção
app.use("/games", checkToken, LikesRouters());

// Usuários
app.use("/users", UserRouters());

// app.get("/games/:gameId/comments/:commentId/responses", (request, response)=>{
//     response.send({
//         text: "retorna todas as respostas de um comentário"
//     });
// });

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor online⚡\nAcesse: http://localhost:${process.env.PORT}/games`)
});