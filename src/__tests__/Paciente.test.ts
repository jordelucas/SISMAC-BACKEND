import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";

import createConnection from '../database';
let connection: Connection;

describe("pacientes", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        connection.undoLastMigration();
        await connection.close();
    })

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
            cpf: "123123122",
            nsus: "111111111",
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

    it("Should be able to get all Pacientes", async () => {
        await request(app).post("/pacientes").send({
            cpf: "1231234",
            nsus: "2222222",
            nome: "clevi",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998-10-30",
            telefone: "8489498494"
        });

        const response = await request(app).get("/pacientes");

        expect(response.body.length).toBe(2);
    })

    it("Should be able to find a Paciente by ID", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "123123455",
            nsus: "222222255",
            nome: "clevi",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998-10-30",
            telefone: "8489498494"
        });

        const id = paciente.body.id;

        const response = await request(app).get("/pacientes/" + id);

        expect(response.status).toBe(200);

    })

    it("Should return a 404 error if ID doesnt exists", async () => {
        const id = uuid();

        const response = await request(app).get("/pacientes/" + id);

        expect(response.status).toBe(404);
    })

    it("Should delete a existing Paciente by ID and not delete the same again", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "12312345",
            nsus: "22222225",
            nome: "clevi",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998-10-30",
            telefone: "8489498494"
        });

        const id = paciente.body.id;

        const response = await request(app).delete("/pacientes/" + id);

        expect(response.status).toBe(200);

        const response2 = await request(app).delete("/pacientes/" + id);

        expect(response2.status).toBe(404)
    })
});