import { NextFunction, Request, Response } from "express";
import { getCustomRepository, Like } from "typeorm";
import { ApiError } from "../error/ApiError";
import { AgendamentosRepository } from "../repositories/AgendamentoRepository";
import { PacientesRepository } from "../repositories/PacientesRepository";

import CheckEmptyFields from "../utils/CheckEmptyFields";
import CheckNullColumns from "../utils/CheckNullColumn";
import ValidDate from "../utils/ValidDate";
class PacienteController {
    async create(request: Request, response: Response, next: NextFunction) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 9) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        if (!ValidDate.isValidDate(request.body.dtNascimento)) {
            next(ApiError.badRequest("Data out of range!"));
            return;
        }

        if (CheckNullColumns.check(request)) {
            next(ApiError.badRequest("column not especified!"));
            return;
        }

        const {
            cpf,
            nsus,
            nome,
            cidade,
            bairro,
            numero,
            complemento,
            dtNascimento,
            telefone
        } = request.body;

        const pacientesRepository = getCustomRepository(PacientesRepository);

        const results = await pacientesRepository.find({
            where: [
                { cpf: cpf },
                { nsus: nsus }
            ]
        })

        if (results.length != 0) {
            next(ApiError.badRequest("Paciente already exists!"));
            return;
        }

        const paciente = pacientesRepository.create({
            cpf,
            nsus,
            nome,
            cidade,
            bairro,
            numero,
            complemento,
            dtNascimento,
            telefone
        })

        await pacientesRepository.save(paciente);

        return response.status(201).json(paciente);
    }

    async show(request: Request, response: Response) {
        const pacientesRepository = getCustomRepository(PacientesRepository);

        const nome = request.query.nome as string;
        const cpf = request.query.cpf as string;
        const nsus = request.query.nsus as string;

        if (nsus) {
            const filteredByNsus = await pacientesRepository.findOne({ nsus });

            return response.json(filteredByNsus);
        }

        if (cpf) {
            const filteredByCpf = await pacientesRepository.findOne({ cpf });

            return response.json(filteredByCpf);
        }

        if (nome) {
            const filteredByName = await pacientesRepository.find(
                {
                    where: `"nome" ILIKE '%${nome}%'`
                }
            );

            return response.json(filteredByName);
        }

        const all = await pacientesRepository.find();

        return response.status(200).json(all);
    }

    async showByID(request: Request, response: Response, next: NextFunction) {
        const pacientesRepository = getCustomRepository(PacientesRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Paciente not found!"));
            return;
        }

        return response.status(200).json(result);
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const pacientesRepository = getCustomRepository(PacientesRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Paciente not found!"));
            return;
        }

        await pacientesRepository.delete(result);

        return response.status(200).json({
            message: "Paciente has been removed!"
        });
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 9) {
            next(ApiError.badRequest("there are not enough values!"));
            return;
        }

        const pacientesRepository = getCustomRepository(PacientesRepository);
        //TODO verificação se request tem menos valores que o esperado
        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Paciente not found!"));
            return;
        }

        const cpfResponse = await pacientesRepository.find(
            {
                where: { cpf: request.body.cpf }
            }
        );

        const nsusResponse = await pacientesRepository.find(
            {
                where: { nsus: request.body.nsus }
            }
        );

        if (request.body.cpf != result.cpf && cpfResponse.length != 0) {
            next(ApiError.badRequest("This CPF already Exists!"));
            return;
        }

        if (request.body.nsus != result.nsus && nsusResponse.length != 0) {
            next(ApiError.badRequest("This NSUS already Exists!"));
            return;
        }
        await pacientesRepository.update(IDRequest, request.body);

        return response.status(200).json(request.body);
    }

    async showSchedules(request: Request, response: Response, next: NextFunction) {
        const pacientesRepository = getCustomRepository(PacientesRepository);
        const agendamentosRepository = getCustomRepository(AgendamentosRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            next(ApiError.notFound("Paciente not found!"));
            return;
        }

        const schedules = await agendamentosRepository.find({
            where: {
                paciente_id: IDRequest
            }
        })

        return response.status(200).json(schedules);
    }

}

export { PacienteController };
