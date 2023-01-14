import { Router } from "express";
import { createUser, loginUser } from "../controllers/UserController";

function UserRouters() {
    const route = Router({ caseSensitive: false });

    route.post("/", createUser);

    route.post("/login", loginUser);

    return route;
}

export default UserRouters;