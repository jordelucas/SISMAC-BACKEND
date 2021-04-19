import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ApiError } from "../error/ApiError";
import { ExamesRepository } from "../repositories/ExamesRepository";

import CheckEmptyFields from "../utils/CheckEmptyFields";
class ExameController {
    async create(request: Request, response: Response, next: NextFunction) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 2) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        if (typeof request.body.autorizacao != "boolean") {
            next(ApiError.badRequest("must be a boolean value!"));
            return;
        }

        const {
            nome,
            autorizacao
        } = request.body;

        const examesRepository = getCustomRepository(ExamesRepository);

        const result = await examesRepository.findOne({ nome })

        const nameResponse = await examesRepository.find(
            {
                where: `"nome" ILIKE '${request.body.nome}'`
            }
        );

        if (result || nameResponse.length != 0) {
            next(ApiError.badRequest("Exame already exists!"));
            return;
        }

        const exame = examesRepository.create({
            nome,
            autorizacao
        })

        await examesRepository.save(exame);

        return response.status(201).json(exame);
    }

    async show(request: Request, response: Response) {
        const examesRepository = getCustomRepository(ExamesRepository);

        const all = await examesRepository.find();

        return response.status(200).json(all);
    }

    async showByID(request: Request, response: Response, next: NextFunction) {
        const examesRepository = getCustomRepository(ExamesRepository);

        const IDRequest = request.params.id;

        const result = await examesRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        return response.status(200).json(result);
    }

    async update(request: Request, response: Response, next: NextFunction) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 2) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        const examesRepository = getCustomRepository(ExamesRepository);

        const IDRequest = request.params.id;

        const result = await examesRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        const nameResponse = await examesRepository.find(
            {
                where: `"nome" ILIKE '${request.body.nome}'`
            }
        );

        if (request.body.nome != result.nome && nameResponse.length != 0) {
            next(ApiError.badRequest("Exame already exists with this name!"));
            return;
        }

        await examesRepository.update(IDRequest, request.body);

        return response.status(200).json(request.body);
    }
}

export { ExameController }