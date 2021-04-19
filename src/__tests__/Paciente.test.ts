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
            dtNascimento: "1998/10/31",
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
            dtNascimento: "1998/10/31",
            telefone: "8494984499"
        });

        expect(response.status).toBe(400);
    })

    it("Should not be able to create a new Pacient if any value is null", async () => {
        const response = await request(app).post("/pacientes").send({
            cpf: "123123122",
            nsus: "111111111",
            nome: "",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/31",
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
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const response = await request(app).get("/pacientes");

        expect(response.body.length).toBe(2);
    })

    it("Should be able to find a Paciente by cpf", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "963",
            nsus: "9632",
            nome: "jord",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const id = paciente.body.id;

        const params = {
            cpf: "963"
        }

        const response = await request(app).get(`/pacientes?cpf=${params.cpf}`);

        expect(response.body.id).toBe(id);
    })

    it("Should be able to find a Paciente by nsus", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "456",
            nsus: "4567",
            nome: "kety",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const id = paciente.body.id;

        const params = {
            nsus: "4567"
        }

        const response = await request(app).get(`/pacientes?nsus=${params.nsus}`);

        expect(response.body.id).toBe(id);
    })

    it("Should be able to find a Paciente by name", async () => {
        await request(app).post("/pacientes").send({
            cpf: "111",
            nsus: "1111",
            nome: "marlon alves",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        await request(app).post("/pacientes").send({
            cpf: "222",
            nsus: "2222",
            nome: "marlon nascimento",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const params = {
            name: "marlon"
        }

        const response = await request(app).get(`/pacientes?nome=${params.name}`);

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
            dtNascimento: "1998/10/30",
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
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const id = paciente.body.id;

        const response = await request(app).delete("/pacientes/" + id);

        expect(response.status).toBe(200);

        const response2 = await request(app).delete("/pacientes/" + id);

        expect(response2.status).toBe(404)
    })

    it("Should update a Paciente with the new informations", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "12312348",
            nsus: "22222228",
            nome: "clev",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const response = await request(app).put("/pacientes/" + paciente.body.id).send({
            cpf: "12312347",
            nsus: "22222227",
            nome: "clevii",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        expect(response.status).toBe(200);
    })

    it("Should return 400 if date is out of range", async () => {
        const response = await request(app).post("/pacientes").send({
            cpf: "12312312266",
            nsus: "11111111166",
            nome: "Clev",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/50",
            telefone: "8494984499"
        });

        expect(response.status).toBe(400);
    })

    it("should not update a Paciente if the new CPF or NSUS are from another Paciente", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "68478",
            nsus: "68478789",
            nome: "Clev",
            cidade: "Cang",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/25",
            telefone: "8494984499"
        });

        const id = paciente.body.id;
        const response = await request(app).put("/pacientes/" + id).send({
            cpf: "12312347",
            nsus: "68478789",
            nome: "Clev",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/26",
            telefone: "8494984499"
        });

        expect(response.status).toBe(400);

        const response2 = await request(app).put("/pacientes/" + id).send({
            cpf: "68478",
            nsus: "22222227",
            nome: "Clev",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/27",
            telefone: "8494984499"
        });

        expect(response2.status).toBe(400);
    })

    it("should not create a Paciente if the column name is empty", async () => {
        const response = await request(app).post("/pacientes").send({
            "": "12312312266",
            nsus: "11111111166",
            nome: "Clev",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/50",
            telefone: "8494984499"
        });

        expect(response.status).toBe(400);
    })

    it("should not update a Paciente if it dont has suficient columns", async () => {
        const paciente = await request(app).post("/pacientes").send({
            cpf: "684781231",
            nsus: "684787892321",
            nome: "Clev",
            cidade: "Cang",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/25",
            telefone: "8494984499"
        });

        const id = paciente.body.id;
        const response = await request(app).put("/pacientes/" + id).send({
            cpf: "684781231",
            nome: "Clev",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998/10/26",
            telefone: "8494984499"
        });

        expect(response.status).toBe(400);
    })
});