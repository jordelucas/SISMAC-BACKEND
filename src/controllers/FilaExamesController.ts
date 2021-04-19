import { getCustomRepository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { FilaExamesRepository } from "../repositories/FilaExamesRepository"
import { PacientesRepository } from '../repositories/PacientesRepository';
import { ExamesRepository } from '../repositories/ExamesRepository';

import CheckEmptyFields from '../utils/CheckEmptyFields';
import { ApiError } from '../error/ApiError';
import CheckNullColumns from '../utils/CheckNullColumn';
class FilaExamesController {
    async create(request: Request, response: Response, next: NextFunction) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 2) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        if (CheckNullColumns.check(request)) {
            next(ApiError.badRequest("column not especified!"));
            return;
        }

        const {
            paciente_id,
            exame_id
        } = request.body;

        const pacienteRepository = getCustomRepository(PacientesRepository);
        const exameRepository = getCustomRepository(ExamesRepository);
        const filaExamesRepository = getCustomRepository(FilaExamesRepository);

        const pacienteResult = await pacienteRepository.findOne(paciente_id);

        const exameResult = await exameRepository.findOne(exame_id);

        if (!pacienteResult) {
            next(ApiError.notFound("Paciente not found!"));
            return;
        }

        if (!exameResult) {
            next(ApiError.notFound("Exame not found!"));
            return;
        }

        const result = await filaExamesRepository.find({
            where: [
                {
                    paciente_id: paciente_id,
                    exame_id: exame_id
                }
            ]
        })

        if (result.length != 0) {
            next(ApiError.badRequest("Member for Fila already exists!"));
            return;
        }

        const member = filaExamesRepository.create({
            paciente_id,
            exame_id
        })

        await filaExamesRepository.save(member);

        return response.status(201).json(member);
    }
}

export { FilaExamesController }