import { Request } from "express";

export default class CheckEmptyFields {
    static check(request: Request) {
        return Object.keys(request.body).some((param: string) => request.body[param] === "" || request.body[param] === null);
    }
}
