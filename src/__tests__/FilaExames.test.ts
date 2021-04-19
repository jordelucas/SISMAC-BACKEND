import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";
import createConnection from '../database';
let connection: Connection;

describe("filaExames", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    beforeEach(async () => {
        connection.undoLastMigration();
        await connection.close();
        connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        connection.undoLastMigration();
        await connection.close();
    })

    it("Should be able to create a new member on FilaExames", async () => {
        const paciente = await request(app).post("/pacientes").send({
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

        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        })

        const response = await request(app).post("/filaExames").send({
            paciente_id: paciente.body.id,
            exame_id: exame.body.id
        })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("Should not create a new member in FilaExames if already exists", async () => {
        const paciente = await request(app).post("/pacientes").send({
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

        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        })

        await request(app).post("/filaExames").send({
            paciente_id: paciente.body.id,
            exame_id: exame.body.id
        })

        const response = await request(app).post("/filaExames").send({
            paciente_id: paciente.body.id,
            exame_id: exame.body.id
        })

        expect(response.status).toBe(400);
    })

    it("Should return 404 if paciente doesnt exists", async () => {
        const id = uuid();

        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        })

        const response = await request(app).post("/filaExames").send({
            paciente_id: id,
            exame_id: exame.body.id
        })

        expect(response.status).toBe(404);
    })

    it("Should not create a new member in FilaExames if any value is null", async () => {
        const paciente = await request(app).post("/pacientes").send({
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

        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        })

        const response = await request(app).post("/filaExames").send({
            paciente_id: paciente.body.id
        })

        expect(response.status).toBe(400);
    })

    it("Should return 404 if exame doesnt exists", async () => {
        const id = uuid();

        const paciente = await request(app).post("/pacientes").send({
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

        const response = await request(app).post("/filaExames").send({
            paciente_id: paciente.body.id,
            exame_id: id
        })

        expect(response.status).toBe(404);
    })

    it("should not create a Fila if the column name is empty", async () => {
        const id = uuid();

        const paciente = await request(app).post("/pacientes").send({
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

        const response = await request(app).post("/filaExames").send({
            "": paciente.body.id,
            exame_id: id
        })

        expect(response.status).toBe(400);
    })
})