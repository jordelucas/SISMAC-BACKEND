import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ExamesRepository } from "../repositories/ExamesRepository";

import CheckEmptyFields from "../utils/CheckEmptyFields";
class ExameController {
    async create(request: Request, response: Response) {

        if (CheckEmptyFields.check(request)) {
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
}

export { ExameController }