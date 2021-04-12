import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";
import FormatDate from '../utils/FormatDate';
import createConnection from '../database';
let connection: Connection;

describe("vagasConsultas", () => {
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


    it("Should be able to create a new VagaConsulta", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to create a new VagaConsulta if it already exists", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        const response2 = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        expect(response2.status).toBe(400);
    })

    it("Should not be able to create a new VagaConsulta if the date is older than the current date", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() - 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should be able to get all VagasConsultas", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        date.setDate(date.getDate() + 1);
        date_string = FormatDate.format(date);

        await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        const response = await request(app).get("/vagasConsultas");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    })

    it("Should be able to find a VagaConsultas by ID", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const vaga = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        const id = vaga.body.id;

        const response = await request(app).get("/vagasConsultas/" + id);

        expect(response.status).toBe(200);

    })

    it("Should return a 404 error if ID doesnt exists", async () => {
        const id = uuid();

        const response = await request(app).get("/vagasConsultas/" + id);

        expect(response.status).toBe(404);
    })

    it("Should not create a new VagaConsultas if any value is null", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should return 400 if date is out of range", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        var date_string = "2021/05/35";

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should be able to find vacancies by consulta ID", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste",
            autorizacao: true,
        })

        const consulta_id = consulta.body.id;

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "Antonio",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta_id
        });

        date.setDate(date.getDate() + 1);
        date_string = FormatDate.format(date);

        await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "Antonio",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: consulta_id
        });

        const response = await request(app).get(`/consultas/${consulta_id}/vagas`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    })

    it("Should return a 404 error if consulta ID does not exist when searching for vacancies", async () => {
        const consulta_id = uuid();

        const response = await request(app).get(`/consultas/${consulta_id}/vagas`);

        expect(response.status).toBe(404);
    })
})