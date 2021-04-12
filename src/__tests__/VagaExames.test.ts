import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";
import FormatDate from '../utils/FormatDate';
import createConnection from '../database';
let connection: Connection;

describe("vagasExames", () => {
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


    it("Should be able to create a new VagaExame", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to create a new VagaExame if it already exists", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        const response2 = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        expect(response2.status).toBe(400);
    })

    it("Should not be able to create a new VagaExame if the date is older than the current date", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        var date = new Date();
        date.setDate(date.getDate() - 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should be able to get all VagasExames", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        date.setDate(date.getDate() + 1);
        date_string = FormatDate.format(date);

        await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        const response = await request(app).get("/vagasExames");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    })

    it("Should be able to find a VagaExames by ID", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const vaga = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        const id = vaga.body.id;

        const response = await request(app).get("/vagasExames/" + id);

        expect(response.status).toBe(200);

    })

    it("Should return a 404 error if ID doesnt exists", async () => {
        const id = uuid();

        const response = await request(app).get("/vagasExames/" + id);

        expect(response.status).toBe(404);
    })

    it("Should not create a new VagaExames if any value is null", async () => {
        const exame = await request(app).post("/exame").send({
            nome: "teste"
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasExames").send({
            nomeEspecialista: "",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: exame.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should return 400 if date is out of range", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste"
        })

        var date_string = "2021/05/35";

        const response = await request(app).post("/vagasExames").send({
            nomeEspecialista: "",
            dataConsulta: date_string,
            quantidade: 5,
            local: "Cang",
            consulta_id: exame.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should be able to find vacancies by exame ID", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        const exame_id = exame.body.id;

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame_id
        });

        date.setDate(date.getDate() + 1);
        date_string = FormatDate.format(date);

        await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame_id
        });

        const response = await request(app).get(`/exames/${exame_id}/vagas`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    })

    it("Should return a 404 error if exame ID does not exist when searching for vacancies", async () => {
        const exame_id = uuid();

        const response = await request(app).get(`/exames/${exame_id}/vagas`);

        expect(response.status).toBe(404);
    })
})