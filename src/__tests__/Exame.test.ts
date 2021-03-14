import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';

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
            nome: "teste",
            autorizacao: true
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("Should not be able to create a new Pacient if it already exists", async () => {
        const response = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        });

        expect(response.status).toBe(400);
    })

})