import { Request } from "express";

export default class CheckEmptyFields {
    static check(request: Request) {
        return Object.keys(request.body).every((key: string) => request.body[key] == "" || request.body[key] == null);
    }
}