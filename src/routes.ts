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
router.delete("/pacientes/:id", pacienteController.delete);
router.put("/pacientes/:id", pacienteController.update);

//Exames
router.post("/exames", exameController.create);
router.get("/exames", exameController.show);
router.get("/exames/:id", exameController.showByID);
export { router }