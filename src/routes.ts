import { Router } from "express";
import { PacienteController } from "./controllers/PacienteController";

const router = Router();

const pacienteController = new PacienteController;

//Endereços
router.post("/pacientes", pacienteController.create);

export { router }