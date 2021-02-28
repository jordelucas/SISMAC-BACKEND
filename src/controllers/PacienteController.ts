import { Request, Response } from "express";

class PacienteController {
    async create(request: Request, response: Response) {
        const body = request.body;
        // const {
        //     cpf,
        //     nsus,
        //     nome,
        //     cidade,
        //     bairro,
        //     numero,
        //     complemento,
        //     dtNascimento,
        //     telefone
        // } = request.body;
        console.log(body)
        return response.send();
    }
}

export { PacienteController }