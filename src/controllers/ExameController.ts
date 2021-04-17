import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ExamesRepository } from "../repositories/ExamesRepository";

import CheckEmptyFields from "../utils/CheckEmptyFields";
class ExameController {
    async create(request: Request, response: Response) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 2) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        if (typeof request.body.autorizacao != "boolean") {
            return response.status(400).json({
                error: "must be a boolean value!",
            })
        }

        const {
            nome,
            autorizacao
        } = request.body;

        const examesRepository = getCustomRepository(ExamesRepository);

        //TODO Verificação com case insenstive
        const result = await examesRepository.findOne({ nome })

        if (result) {
            return response.status(400).json({
                error: "Exame already exists!",
            })
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

    async showByID(request: Request, response: Response) {
        const examesRepository = getCustomRepository(ExamesRepository);

        const IDRequest = request.params.id;

        const result = await examesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Exame not found!",
            })
        }

        return response.status(200).json(result);
    }

    async update(request: Request, response: Response) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 2) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        const examesRepository = getCustomRepository(ExamesRepository);

        const IDRequest = request.params.id;

        const result = await examesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Exame not found!",
            })
        }

        const nameResponse = await examesRepository.find(
            {
                where: `"nome" ILIKE '${request.body.nome}'`
            }
        );

        if (nameResponse.length != 0) {
            return response.status(400).json({
                error: "Consulta already exists with this name!",
            })
        }

        await examesRepository.update(IDRequest, request.body);

        return response.status(200).json(request.body);
    }
}

export { ExameController }