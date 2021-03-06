import { getCustomRepository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { ConsultasRepository } from '../repositories/ConsultasRepository';
import { VagaConsultasRepository } from '../repositories/VagaConsultasRepository';

import CheckEmptyFields from '../utils/CheckEmptyFields';
import { ApiError } from '../error/ApiError';
import CheckNullColumns from '../utils/CheckNullColumn';
class ConsultaController {
    async create(request: Request, response: Response, next: NextFunction) {
        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 1) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        if (CheckNullColumns.check(request)) {
            next(ApiError.badRequest("column not especified!"));
            return;
        }

        const { nome } = request.body;

        const consultasRepository = getCustomRepository(ConsultasRepository)

        const result = await consultasRepository.findOne({ nome })

        const nameResponse = await consultasRepository.find(
            {
                where: `"nome" ILIKE '${request.body.nome}'`
            }
        );

        if (result || nameResponse.length != 0) {
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

    async showByID(request: Request, response: Response, next: NextFunction) {
        const consultasRepository = getCustomRepository(ConsultasRepository);

        const IDRequest = request.params.id;

        const result = await consultasRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Consulta not found!"));
            return;
        }

        return response.status(200).json(result);
    }

    async showVagasByConsultaID(request: Request, response: Response, next: NextFunction) {
        const consultasRepository = getCustomRepository(ConsultasRepository);

        const IDConsultaRequest = request.params.id;

        const filteredConsulta = await consultasRepository.findOne(IDConsultaRequest);

        if (!filteredConsulta) {
            next(ApiError.notFound("Consulta not found!"));
            return;
        }

        const vagaConsultasRepository = getCustomRepository(VagaConsultasRepository);

        const filteredVagasConsulta = await vagaConsultasRepository.find({
            where: {
                consulta_id: IDConsultaRequest
            },
            order: {
                dataConsulta: "ASC"
            }
        })

        return response.status(200).json(filteredVagasConsulta);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 1) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        const consultasRepository = getCustomRepository(ConsultasRepository);

        const IDRequest = request.params.id;

        const result = await consultasRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Consulta not found!"));
            return;
        }

        const nameResponse = await consultasRepository.find(
            {
                where: `"nome" ILIKE '${request.body.nome}'`
            }
        );

        if (nameResponse.length != 0) {
            next(ApiError.badRequest("Consulta already exists with this name!"));
            return;
        }

        await consultasRepository.update(IDRequest, request.body);

        return response.status(200).json(request.body);
    }
}

export { ConsultaController }