import { Router } from "express";
import { PacienteController } from "./controllers/PacienteController";

const router = Router();

const pacienteController = new PacienteController;

//Endereços
router.post("/pacientes", pacienteController.create);
router.get("/pacientes", pacienteController.show);

export { router }