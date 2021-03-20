import { Router } from "express";
import { ExameController } from "./controllers/ExameController";
import { PacienteController } from "./controllers/PacienteController";

const router = Router();

const pacienteController = new PacienteController;
const exameController = new ExameController;

//Endereços
//Paciente
router.post("/pacientes", pacienteController.create);
router.get("/pacientes", pacienteController.show);
//Rotas para ID de pacientes
router.get("/pacientes/:id", pacienteController.showByID);

//Exames
router.post("/exames", exameController.create);
export { router }