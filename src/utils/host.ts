import { Request } from "express";

function host(request: Request) {
    return `http://${request.hostname}:${process.env.PORT || 3024}`
}

export { host }