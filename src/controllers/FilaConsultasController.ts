import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { FilaConsultasRepository } from "../repositories/FilaConsultasRepository"
import { PacientesRepository } from '../repositories/PacientesRepository';
import { ConsultasRepository } from '../repositories/ConsultasRepository';

class FilaConsultasController {
    async create(request: Request, response: Response) {

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
            return response.status(404).json({
                error: "Paciente not found!",
            })
        }

        if (!consultaResult) {
            return response.status(404).json({
                error: "Consulta not found!",
            })
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
            return response.status(400).json({
                error: "Member for Fila already exists!",
            })
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