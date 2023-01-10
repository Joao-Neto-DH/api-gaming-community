import Express from "express";
import { PrismaClient } from "@prisma/client";

const app = Express();
const prisma = new PrismaClient();

// Jogos
app.get("/games", (request, response)=> {

});
app.get("/games/:id", (request, response)=> {
    
});

// Comentários
app.post("/comments", (request, response)=> {
    
});
app.get("/comments/:id/responses", (request, response)=>{

});

app.listen(3024, ()=>{
    console.log("Online")
});