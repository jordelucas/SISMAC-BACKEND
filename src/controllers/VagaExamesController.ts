import { getCustomRepository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { VagaExamesRepository } from '../repositories/VagaExamesRepository';
import { ExamesRepository } from '../repositories/ExamesRepository';

import ValidDate from '../utils/ValidDate';
import CheckEmptyFields from '../utils/CheckEmptyFields';
import { AgendamentosRepository } from '../repositories/AgendamentoRepository';
import { ApiError } from '../error/ApiError';

class VagaExamesController {
    async create(request: Request, response: Response, next: NextFunction) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 4) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        if (!ValidDate.isValidDate(request.body.dataExame)) {
            next(ApiError.badRequest("Data out of range!"));
            return;
        }

        var today = new Date();
        var dateDataExame = new Date(request.body.dataExame);

        if (dateDataExame <= today) {
            next(ApiError.badRequest("dataExame is older then actual data!"));
            return;
        }

        const {
            dataExame,
            quantidade,
            local,
            exame_id
        } = request.body;

        const disponivel = quantidade;

        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);
        const exameRepository = getCustomRepository(ExamesRepository);

        const exameResult = await exameRepository.findOne(exame_id);

        if (!exameResult) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        const result = await vagaExamesRepository.find({
            where: [
                {
                    exame_id: exame_id,
                    dataExame: dataExame
                }
            ]
        })

        if (result.length != 0) {
            next(ApiError.badRequest("Vaga for Exame already exists!"));
            return;
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

    async showByID(request: Request, response: Response, next: NextFunction) {
        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);
        const exameRepository = getCustomRepository(ExamesRepository);

        const IDRequest = request.params.id;

        const vaga = await vagaExamesRepository.findOne(IDRequest);

        if (!vaga) {
            next(ApiError.notFound("Vaga not found!"));
            return;
        }

        const exame = await exameRepository.findOne(vaga.exame_id);

        if (!exame) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        return response.status(200).json({...vaga, nomeExame: exame.nome});
    }

    async showVagasByExameID(request: Request, response: Response, next: NextFunction) {
        const examesRepository = getCustomRepository(ExamesRepository);

        const IDExameRequest = request.params.id;

        const filteredExame = await examesRepository.findOne(IDExameRequest);

        if (!filteredExame) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);

        const filteredVagasExame = await vagaExamesRepository.find({
            exame_id: IDExameRequest
        })

        return response.status(200).json(filteredVagasExame);
    }

    async showScheduling(request: Request, response: Response, next: NextFunction) {
        const examesRepository = getCustomRepository(ExamesRepository);
        const vagaExamesRepository = getCustomRepository(VagaExamesRepository);
        const agendamentosRepository = getCustomRepository(AgendamentosRepository);

        const IDRequest = request.params.id;

        const vaga = await vagaExamesRepository.findOne(IDRequest);

        if (!vaga) {
            next(ApiError.notFound("Vaga not found!"));
            return;
        }

        const exame = await examesRepository.findOne(vaga.exame_id);

        if (!exame) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        const schedules = await agendamentosRepository.find({
            select: ['id', 'vaga_id', 'paciente'],
            where: {
                type: "exame",
                vaga_id: IDRequest,
            },
            relations: ["paciente"],
        })

        return response.status(200).json({
            nome: exame.nome,
            data: vaga.dataExame,
            pacientesAgendados: schedules,
        });
    }
}

export { VagaExamesController }