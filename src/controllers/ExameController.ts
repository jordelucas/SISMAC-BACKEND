import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ExamesRepository } from "../repositories/ExamesRepository";

class ExameController {
    async create(request: Request, response: Response) {

        if (request.body.nome === "") {
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
}

export { ExameController }