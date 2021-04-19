import { getCustomRepository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { FilaConsultasRepository } from "../repositories/FilaConsultasRepository"
import { PacientesRepository } from '../repositories/PacientesRepository';
import { ConsultasRepository } from '../repositories/ConsultasRepository';

import CheckEmptyFields from '../utils/CheckEmptyFields';
import { ApiError } from '../error/ApiError';
class FilaConsultasController {
    async create(request: Request, response: Response, next: NextFunction) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 2) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        const {
            paciente_id,
            consulta_id
        } = request.body;

        const pacienteRepository = getCustomRepository(PacientesRepository);
        const consultaRepository = getCustomRepository(ConsultasRepository);
        const filaConsultaRepository = getCustomRepository(FilaConsultasRepository);

        const pacienteResult = await pacienteRepository.findOne(paciente_id);

        const consultaResult = await consultaRepository.findOne(consulta_id);

        if (!pacienteResult) {
            next(ApiError.notFound("Paciente not found!"));
            return;
        }

        if (!consultaResult) {
            next(ApiError.notFound("Consulta not found!"));
            return;
        }

        const result = await filaConsultaRepository.find({
            where: [
                {
                    paciente_id: paciente_id,
                    consulta_id: consulta_id
                }
            ]
        })

        if (result.length != 0) {
            next(ApiError.badRequest("Member for Fila already exists!"));
            return;
        }

        const member = filaConsultaRepository.create({
            paciente_id,
            consulta_id
        })

        await filaConsultaRepository.save(member);

        return response.status(201).json(member);
    }
}

export { FilaConsultasController }