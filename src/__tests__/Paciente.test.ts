import request from 'supertest';
import { app } from '../app';

describe("Pacientes", () => {

    request(app).post("/pacientes")
        .send({
            cpf: "123123123",
            nsus: "111111111",
            nome: "clev",
            cidade: "cang",
            bairro: "sertãozinho",
            numero: "25",
            complemento: "casa",
            dtNascimento: "1998-10-31",
            telefone: "8494984499"
        })
})