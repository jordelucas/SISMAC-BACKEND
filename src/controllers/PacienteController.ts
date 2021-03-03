import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Paciente } from "../models/Paciente";

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

        const pacientesRepository = getRepository(Paciente);

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

        console.log(paciente.dtNascimento);

        await pacientesRepository.save(paciente);

        return response.json(paciente);
    }
}

export { PacienteController }