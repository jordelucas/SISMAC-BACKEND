import { Connection } from 'typeorm';
import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';
let connection: Connection;

describe("consultas", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        connection.undoLastMigration();
        await connection.close();
    })

    it("Should be able to create a new Consulta", async () => {
        const response = await request(app).post("/consultas").send({
            nome: "teste"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("Should not be able to create a new Consulta if it already exists", async () => {
        const response = await request(app).post("/consultas").send({
            nome: "teste"
        });

        expect(response.status).toBe(400);
    })

    it("Should not be able to create a new Consulta if nome value is empty", async () => {
        const response = await request(app).post("/consultas").send({
            nome: ""
        });

        expect(response.status).toBe(400);
    })

    it("Should be able to get all Consultas", async () => {
        await request(app).post("/consultas").send({
            nome: "teste segundo"
        });

        const response = await request(app).get("/consultas");

        expect(response.body.length).toBe(2);
    })

    it("Should be able to find a Consulta by ID", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste3"
        });

        const id = consulta.body.id;

        const response = await request(app).get("/consultas/" + id);

        expect(response.status).toBe(200);

    })

    it("Should update a Consulta with the new informations", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste4"
        });

        const response = await request(app).put("/consultas/" + consulta.body.id).send({
            nome: "teste5"
        });

        expect(response.status).toBe(200);
    })

    it("Should not update a Consulta it has any null value", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste4"
        });

        const response = await request(app).put("/consultas/" + consulta.body.id).send({
            nome: ""
        });

        expect(response.status).toBe(400);
    })

    it("Should not update a Consulta the name value already exists", async () => {
        const consulta = await request(app).post("/consultas").send({
            nome: "teste6"
        });

        const response = await request(app).put("/consultas/" + consulta.body.id).send({
            nome: "teste4"
        });

        expect(response.status).toBe(400);
    })

    it("should not create a Consulta if your name has already been used with an insensitive case ", async () => {
        await request(app).post("/consultas").send({
            nome: "teste7"
        });

        const response = await request(app).post("/consultas").send({
            nome: "Teste7"
        });

        expect(response.status).toBe(400);
    })

    it("should not create a Consulta if the column name is empty", async () => {
        const response = await request(app).post("/consultas").send({
            "": "teste"
        });

        expect(response.status).toBe(400);
    })
})