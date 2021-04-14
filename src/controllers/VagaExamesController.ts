import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { VagaExamesRepository } from '../repositories/VagaExamesRepository';
import { ExamesRepository } from '../repositories/ExamesRepository';

import ValidDate from '../utils/ValidDate';
import CheckEmptyFields from '../utils/CheckEmptyFields';
class VagaExamesController {
    async create(request: Request, response: Response) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 4) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        if (!ValidDate.isValidDate(request.body.dataExame)) {
            return response.status(400).json({
                error: "Data out of range!",
            })
        }

        var today = new Date();
        var dateDataExame = new Date(request.body.dataExame);

        if (dateDataExame <= today) {
            return response.status(400).json({
                error: "dataExame is older then actual data!",
            })
        }

        const {
            dataExame,
            quantidade,
            local,
            exame_id
        } = request.body;

        const disponivel = quantidade;

        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);

        const result = await vagaExamesRepository.find({
            where: [
                {
                    exame_id: exame_id,
                    dataExame: dataExame
                }
            ]
        })

        if (result.length != 0) {
            return response.status(400).json({
                error: "Vaga for Exame already exists!",
            })
        }

        const vagaExame = vagaExamesRepository.create({
            dataExame,
            quantidade,
            disponivel,
            local,
            exame_id
        })

        await vagaExamesRepository.save(vagaExame);

        return response.status(201).json(vagaExame);

    }

    async show(request: Request, response: Response) {
        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);

        const all = await vagaExamesRepository.find();

        return response.status(200).json(all);
    }

    async showByID(request: Request, response: Response) {
        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);

        const IDRequest = request.params.id;

        const result = await vagaExamesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Vaga not found!",
            })
        }

        return response.status(200).json(result);
    }

    async showVagasByExameID(request: Request, response: Response) {
        const examesRepository = getCustomRepository(ExamesRepository);

        const IDExameRequest = request.params.id;

        const filteredExame = await examesRepository.findOne(IDExameRequest);

        if (!filteredExame) {
            return response.status(404).json({
                error: "Exame not found!",
            })
        }

        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);

        const filteredVagasExame = await vagaExamesRepository.find({
            exame_id: IDExameRequest
        })

        return response.status(200).json(filteredVagasExame);
    }
}

export { VagaExamesController }