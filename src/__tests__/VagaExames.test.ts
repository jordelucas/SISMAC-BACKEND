import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { app } from '../app';
import { v4 as uuid } from "uuid";
import FormatDate from '../utils/FormatDate';
import createConnection from '../database';
import { AgendamentoController } from '../controllers/AgendamentoController';
const agendamentoController = new AgendamentoController();
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

    it("Should not be able to create a new VagaExame if any value is null", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true,
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            local: "",
            exame_id: exame.body.id
        });

        expect(response.status).toBe(400);
    })

    it("Should return 404 if exame doesnt exists", async () => {
        const id = uuid();

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: id
        });

        expect(response.status).toBe(404);
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
            nome: "teste",
            autorizacao: true
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

        expect(response.status).toBe(400);
    })

    it("Should return 400 if date is out of range", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        })

        var date_string = "2021/05/35";

        const response = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
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

    it("should be able to return all schedules made for Exames", async () => {
        const paciente1 = await request(app).post("/pacientes").send({
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

        const paciente2 = await request(app).post("/pacientes").send({
            cpf: "4567",
            nsus: "45678",
            nome: "clev",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "20",
            complemento: "casa",
            dtNascimento: "1998/10/30",
            telefone: "8489498494"
        });

        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        });

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const vagaExame = await request(app).post("/vagasExames").send({
            dataExame: date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        await request(app).post("/filaExames").send({
            paciente_id: paciente1.body.id,
            exame_id: exame.body.id
        })

        await request(app).post("/filaExames").send({
            paciente_id: paciente2.body.id,
            exame_id: exame.body.id
        })

        await agendamentoController.toSchedule();

        const response = await request(app).get("/vagasExames/" + vagaExame.body.id + "/agendamentos");

        expect(response.status).toBe(200);
        expect(response.body.pacientesAgendados.length).toBe(2);

        const vagasResponse = await request(app).get("/vagasExames/" + vagaExame.body.id);
        expect(vagasResponse.body.disponivel).toBe(3);
    })

    it("should not create a Vaga of exame if the column name is empty", async () => {
        const exame = await request(app).post("/exames").send({
            nome: "teste",
            autorizacao: true
        })

        var date = new Date();
        date.setDate(date.getDate() + 1);
        var date_string = FormatDate.format(date);

        const response = await request(app).post("/vagasExames").send({
            "": date_string,
            quantidade: 5,
            local: "Cang",
            exame_id: exame.body.id
        });

        expect(response.status).toBe(400);
    })
})