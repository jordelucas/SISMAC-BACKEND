import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { ConsultasRepository } from '../repositories/ConsultasRepository';

class ConsultaController {
    async create(request: Request, response: Response) {

        if (request.body.nome === "") {
            return response.status(400).json({
                error: "there are not enough values!",
            })
        }

        const { nome } = request.body;

        const consultasRepository = getCustomRepository(ConsultasRepository)

        const result = await consultasRepository.findOne({ nome })

        if (result) {
            return response.status(400).json({
                error: "Exame already exists!",
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
}

export { ConsultaController }