import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { ConsultasRepository } from '../repositories/ConsultasRepository';
import { VagaConsultasRepository } from '../repositories/VagaConsultasRepository';

import CheckEmptyFields from '../utils/CheckEmptyFields';
class ConsultaController {
    async create(request: Request, response: Response) {

        if (CheckEmptyFields.check(request)) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        const { nome } = request.body;

        const consultasRepository = getCustomRepository(ConsultasRepository)

        const result = await consultasRepository.findOne({ nome })

        if (result) {
            return response.status(400).json({
                error: "Consulta already exists!",
            })
        }

        const consulta = consultasRepository.create({ nome })

        await consultasRepository.save(consulta);

        return response.status(201).json(consulta)
    }

    async show(request: Request, response: Response) {

        const consultasRepository = getCustomRepository(ConsultasRepository);

        const all = await consultasRepository.find();

        return response.status(200).json(all);
    }

    async showByID(request: Request, response: Response) {
        const consultasRepository = getCustomRepository(ConsultasRepository);

        const IDRequest = request.params.id;

        const result = await consultasRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Consulta not found!",
            })
        }

        return response.status(200).json(result);
    }

    async showVagasByConsultaID(request: Request, response: Response) {
        const consultasRepository = getCustomRepository(ConsultasRepository);

        const IDConsultaRequest = request.params.id;

        const filteredConsulta = await consultasRepository.findOne(IDConsultaRequest);

        if (!filteredConsulta) {
            return response.status(404).json({
                error: "Consulta not found!",
            })
        }

        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);

        const filteredVagasConsulta = await vagaConsultasRepository.find({
            consulta_id: IDConsultaRequest
        })

        return response.status(200).json(filteredVagasConsulta);
    }
}

export { ConsultaController }