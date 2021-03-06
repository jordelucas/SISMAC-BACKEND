import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe("Pacientes", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });


    it("Should be able to create a new Paciente", async () => {
        const response = await request(app).post("/pacientes").send({
            cpf: "123123123",
            nsus: "111111111",
            nome: "clev",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998-10-31",
            telefone: "8494984499"
        })

        expect(response.status).toBe(201);
    });

});