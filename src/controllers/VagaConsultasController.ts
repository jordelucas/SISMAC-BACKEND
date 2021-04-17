import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { VagaConsultasRepository } from "../repositories/VagaConsultasRepository";
import { ConsultasRepository } from '../repositories/ConsultasRepository';

import ValidDate from '../utils/ValidDate';
import CheckEmptyFields from '../utils/CheckEmptyFields';
import { AgendamentosRepository } from '../repositories/AgendamentoRepository';

class VagaConsultasController {
    async create(request: Request, response: Response) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 5) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        if (!ValidDate.isValidDate(request.body.dataConsulta)) {
            return response.status(400).json({
                error: "Data out of range!",
            })
        }

        const {
            nomeEspecialista,
            dataConsulta,
            quantidade,
            local,
            consulta_id
        } = request.body;

        const disponivel = quantidade;

        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);
        const consultaRepository = getCustomRepository(ConsultasRepository);

        const consultaResult = await consultaRepository.findOne(consulta_id);

        if (!consultaResult) {
            return response.status(404).json({
                error: "Consulta not found!",
            })
        }

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
            disponivel,
            local,
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

    async showScheduling(request: Request, response: Response) {
        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);
        const agendamentosRepository = getCustomRepository(AgendamentosRepository);

        const IDRequest = request.params.id;

        const result = await vagaConsultasRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Vaga not found!",
            })
        }

        const schedules = await agendamentosRepository.find({
            where: {
                type: "consulta",
                vaga_id: IDRequest,
            }
        })

        return response.status(200).json(schedules);
    }
}

export { VagaConsultasController }