import Express from "express";

const app = Express();

app.get("/", (req, res)=> {
    res.send({
        message: "ola",
        method: "GET"
    })
});
app.post("/", (req, res)=> {
    res.send({
        method: "POST"
    })
});
app.get("/:id", (req, res)=>{
    let id = req.params.id;
    
    res.send({
        id,
        ...req.body || {"msg":"falha"}
    })
});

app.listen(3024, ()=>{
    console.log("Online")
});