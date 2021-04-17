import { Request, Response } from "express";
import { getCustomRepository, Like } from "typeorm";
import { AgendamentosRepository } from "../repositories/AgendamentoRepository";
import { PacientesRepository } from "../repositories/PacientesRepository";

import CheckEmptyFields from "../utils/CheckEmptyFields";
import ValidDate from "../utils/ValidDate";
class PacienteController {
    async create(request: Request, response: Response) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 9) {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        if (!ValidDate.isValidDate(request.body.dtNascimento)) {
            return response.status(400).json({
                error: "Data out of range!",
            })
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
            return response.status(400).json({
                error: "Paciente already exists!",
            })
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

    async showByID(request: Request, response: Response) {
        const pacientesRepository = getCustomRepository(PacientesRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Paciente not found!",
            })
        }

        return response.status(200).json(result);
    }

    async delete(request: Request, response: Response) {
        const pacientesRepository = getCustomRepository(PacientesRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Paciente not found!",
            })
        }

        await pacientesRepository.delete(result);

        return response.status(200).json({
            message: "Paciente has been removed!"
        });
    }

    async update(request: Request, response: Response) {
        const pacientesRepository = getCustomRepository(PacientesRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Paciente not found!",
            })
        }
        //TODO verificação de alteração para CPF já existente
        await pacientesRepository.update(IDRequest, request.body);

        return response.status(200).json(request.body);
    }

    async showSchedules(request: Request, response: Response) {
        const pacientesRepository = getCustomRepository(PacientesRepository);
        const agendamentosRepository = getCustomRepository(AgendamentosRepository);

        const IDRequest = request.params.id;

        const result = await pacientesRepository.findOne(IDRequest);

        if (!result) {
            return response.status(404).json({
                error: "Vaga not found!",
            })
        }

        const schedules = await agendamentosRepository.find({
            where: {
                paciente_id: IDRequest
            }
        })

        if (schedules.length == 0) {
            return response.status(404).json({
                error: "There is no schedule for that pacient",
            })
        }

        return response.status(200).json(schedules);
    }

}

export { PacienteController };
