import { Router } from "express";
import { ConsultaController } from "./controllers/ConsultaController";
import { ExameController } from "./controllers/ExameController";
import { PacienteController } from "./controllers/PacienteController";
import { VagaConsultasController } from "./controllers/VagaConsultasController";

const router = Router();

const pacienteController = new PacienteController;
const exameController = new ExameController;
const consultaController = new ConsultaController;
const vagaConsultasController = new VagaConsultasController

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

//Consultas
router.post("/consultas", consultaController.create);
router.get("/consultas", consultaController.show);
//Rotas para ID de consultas
router.get("/consultas/:id", consultaController.showByID)

//Vagas Consultas
router.post("/vagasConsultas", vagaConsultasController.create)
export { router }