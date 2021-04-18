import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";

import createConnection from '../database';
let connection: Connection;

describe("exames", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        connection.undoLastMigration();
        await connection.close();
    })

    it("Should be able to create a new Exame", async () => {
        const response = await request(app).post("/exames").send({
            nome: "mamografia",
            autorizacao: true
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("Should not be able to create a new Exame if it already exists", async () => {
        const response = await request(app).post("/exames").send({
            nome: "mamografia",
            autorizacao: true
        });

        expect(response.status).toBe(400);
    })

    it("Should not be able to create a new Exame if nome value is empty", async () => {
        const response = await request(app).post("/exames").send({
            nome: "",
            autorizacao: true
        });

        expect(response.status).toBe(400);
    })

    it("Should not be able to create a new Exame if autorizacao type is not boolean", async () => {
        const response = await request(app).post("/exames").send({
            nome: "teste2",
            autorizacao: "true"
        });

        expect(response.status).toBe(400);
    })

    it("Should be able to get all Exames", async () => {
        await request(app).post("/exames").send({
            nome: "ecocardiograma",
            autorizacao: true
        });

        const response = await request(app).get("/exames");

        expect(response.body.length).toBe(2);
    })

    it("Should be able to find a Exame by ID", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "eletrocardiograma",
            autorizacao: true
        });

        const id = exame.body.id;

        const response = await request(app).get("/exames/" + id);

        expect(response.status).toBe(200);
    })

    it("Should return a 404 error if ID doesnt exists", async () => {
        const id = uuid();

        const response = await request(app).get("/exames/" + id);

        expect(response.status).toBe(404);
    })

    it("Should update a Exame with the new informations", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste3",
            autorizacao: true
        });

        const response = await request(app).put("/exames/" + exame.body.id).send({
            nome: "teste4",
            autorizacao: false
        });

        expect(response.status).toBe(200);
    })

    it("Should not update a Exame if the new value is empty", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste3",
            autorizacao: true
        });

        const response = await request(app).put("/exames/" + exame.body.id).send({
            nome: "",
            autorizacao: false
        });

        expect(response.status).toBe(400);
    })

    it("Should not update a Exame the name value already exists", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste6"
        });

        const response = await request(app).put("/exames/" + exame.body.id).send({
            nome: "teste4"
        });

        expect(response.status).toBe(400);
    })

    it("should not create a Exame if your name has already been used with an insensitive case ", async () => {
        await request(app).post("/exames").send({
            nome: "teste7"
        });

        const response = await request(app).post("/exames").send({
            nome: "Teste7"
        });

        expect(response.status).toBe(400);
    })
})