import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { FilaExamesRepository } from "../repositories/FilaExamesRepository"
import { PacientesRepository } from '../repositories/PacientesRepository';
import { ExamesRepository } from '../repositories/ExamesRepository';

import CheckEmptyFields from '../utils/CheckEmptyFields';
class FilaExamesController {
    async create(request: Request, response: Response) {

        if (CheckEmptyFields.check(request)) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
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
            return response.status(404).json({
                error: "Paciente not found!",
            })
        }

        if (!exameResult) {
            return response.status(404).json({
                error: "Exame not found!",
            })
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
            return response.status(400).json({
                error: "Member for Fila already exists!",
            })
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