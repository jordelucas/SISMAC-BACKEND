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

        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);

        const result = await vagaConsultasRepository.find({
            where: [
                {
                    consulta_id: consulta_id,
                    dataConsulta: dataConsulta
                }
            ]
        })

        if (result.length != 0) {
            return response.status(400).json({
                error: "Vaga for Consulta already exists!",
            })
        }

        var today = new Date();
        var dateDataConsulta = new Date(dataConsulta);

        if (dateDataConsulta <= today) {
            return response.status(400).json({
                error: "dataConsulta is older then actual data!",
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

    async show(request: Request, response: Response) {
        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);

        const all = await vagaConsultasRepository.find();

        return response.status(200).json(all);
    }

    async showByID(request: Request, response: Response) {
        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);

        const IDRequest = request.params.id;

        const result = await vagaConsultasRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Vaga not found!",
            })
        }

        return response.status(200).json(result);
    }
}

export { VagaConsultasController }