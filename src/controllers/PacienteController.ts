import { Request, Response } from "express";
import { getCustomRepository, Like } from "typeorm";
import { PacientesRepository } from "../repositories/PacientesRepository";

import CheckEmptyFields from "../utils/CheckEmptyFields";
class PacienteController {
    async create(request: Request, response: Response) {

        const resquestSize = Object.keys(request.body).length;

        if (CheckEmptyFields.check(request) || resquestSize < 9) {
            return response.status(400).json({
                error: "there are not enough values!",
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
            const filteredByCpf = await pacientesRepository.find({ nome: Like(`%${nome}%`) });

            return response.json(filteredByCpf);
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

        await pacientesRepository.update(IDRequest, request.body);

        return response.status(200).json(request.body);
    }
}

export { PacienteController };
