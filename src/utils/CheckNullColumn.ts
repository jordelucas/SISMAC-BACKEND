import { Request } from "express";

export default class CheckNullColumns {
  static check(request: Request) {
    return Object.keys(request.body).some((param: string) => param === "" || param === null);
  }
}