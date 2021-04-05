import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";

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
        await connection.close();
    })


    it("Should be able to create a new VagaConsulta", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: "2021/04/25",
            quantidade: 5,
            consulta_id: consulta.body.id
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to create a new VagaConsulta if it already exists", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: "2021/04/25",
            quantidade: 5,
            consulta_id: consulta.body.id
        });

        const response2 = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: "2021/04/25",
            quantidade: 5,
            consulta_id: consulta.body.id
        });

        expect(response2.status).toBe(400);
    })

    it("Should not be able to create a new VagaConsulta if the date is older than the current date", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste"
        })

        const response = await request(app).post("/vagasConsultas").send({
            nomeEspecialista: "jose",
            dataConsulta: "2021/04/01",
            quantidade: 5,
            consulta_id: consulta.body.id
        });

        expect(response.status).toBe(400);
    })
})