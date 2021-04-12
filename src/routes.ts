import { Router } from "express";
import { ConsultaController } from "./controllers/ConsultaController";
import { ExameController } from "./controllers/ExameController";
import { FilaConsultasController } from "./controllers/FilaConsultasController";
import { PacienteController } from "./controllers/PacienteController";
import { VagaConsultasController } from "./controllers/VagaConsultasController";
import { VagaExamesController } from "./controllers/VagaExamesController";

const router = Router();

const pacienteController = new PacienteController;
const exameController = new ExameController;
const consultaController = new ConsultaController;
const vagaConsultasController = new VagaConsultasController;
const vagaExamesController = new VagaExamesController;
const filaConsultasController = new FilaConsultasController;

//Endereços
//Paciente
router.post("/pacientes", pacienteController.create);
router.get("/pacientes", pacienteController.show);
//Rotas para ID de pacientes
router.get("/pacientes/:id", pacienteController.showByID);
router.delete("/pacientes/:id", pacienteController.delete);
router.put("/pacientes/:id", pacienteController.update);

//Exames
router.post("/exames", exameController.create);
router.get("/exames", exameController.show);
//Rotas para ID de Exames
router.get("/exames/:id", exameController.showByID);

//Rota para vaga de um exame
router.get("/exames/:id/vagas", vagaExamesController.showVagasByExameID);

//Consultas
router.post("/consultas", consultaController.create);
router.get("/consultas", consultaController.show);
//Rotas para ID de Consultas
router.get("/consultas/:id", consultaController.showByID);

//Rota para vagas de uma consulta
router.get("/consultas/:id/vagas", consultaController.showVagasByConsultaID);

//Vagas Consultas
router.post("/vagasConsultas", vagaConsultasController.create);
router.get("/vagasConsultas", vagaConsultasController.show);
//Rotas para ID de VagasConsultas
router.get("/vagasConsultas/:id", vagaConsultasController.showByID);

//Vagas Exames
router.post("/vagasExames", vagaExamesController.create);
router.get("/vagasExames", vagaExamesController.show);
//Rotas para ID de VagasExames
router.get("/vagasExames/:id", vagaExamesController.showByID);

//Fila de consultas
router.post("/filaConsultas", filaConsultasController.create);
export { router }