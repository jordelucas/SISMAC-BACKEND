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

        const pacienteAlreadyExists = await pacientesRepository.findOne({
            cpf,
            nsus
        })

        if (pacienteAlreadyExists) {
            return response.status(400).json({
                error: "Paciente already exists!",
            });
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
}

export { PacienteController };
