import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { VagaConsultasRepository } from "../repositories/VagaConsultasRepository";

class VagaConsultasController {
    async create(request: Request, response: Response) {
        const {
            nomeEspecialista,
            dataConsulta,
            quantidade,
            consulta_id
        } = request.body;

        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository)

        const result = await vagaConsultasRepository.findOne({ consulta_id })

        if (result) {
            return response.status(400).json({
                error: "Vaga for Consulta already exists!",
            })
        }

        const vagaConsulta = vagaConsultasRepository.create({
            nomeEspecialista,
            dataConsulta,
            quantidade,
            consulta_id
        })

        await vagaConsultasRepository.save(vagaConsulta);

        return response.status(201).json(vagaConsulta);

    }


}

export { VagaConsultasController }