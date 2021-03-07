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
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to create a new Pacient if it already exists", async () => {
        const response = await request(app).post("/pacientes").send({
            cpf: "123123123",
            nsus: "111111112",
            nome: "clev",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998-10-31",
            telefone: "8494984499"
        });

        expect(response.status).toBe(400);
    })

    // it("Should be able to get all Pacientes", async () => {
    //     await request(app).post("/pacientes").send({
    //         cpf: "1231234",
    //         nsus: "2222222",
    //         nome: "clevi",
    //         cidade: "cang",
    //         bairro: "sertãozinho",
    //         numero: "20",
    //         complemento: "casa",
    //         dtNascimento: "1998-10-30",
    //         telefone: "8489498494"
    //     });

    //     const response = await request(app).get("/pacientes");

    //     expect(response.body.length).toBe(9);
    // })

});