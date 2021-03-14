import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { PacientesRepository } from "../repositories/PacientesRepository";

class PacienteController {
    async create(request: Request, response: Response) {
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

        const cpf = request.query.cpf as string;
        const nsus = request.query.nsus as string;

        if (nsus) {
            const filteredByNsus = await pacientesRepository.findOne({nsus});

            return response.json(filteredByNsus);
        }

        if (cpf) {
            const filteredByCpf = await pacientesRepository.findOne({cpf});

            return response.json(filteredByCpf);
        }
        const all = await pacientesRepository.find();

        return response.json(all);
    }
}

export { PacienteController };
