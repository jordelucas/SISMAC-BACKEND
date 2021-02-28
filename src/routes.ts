import { Router } from "express";
import { PacienteController } from "./controllers/PacienteController";

const router = Router();

const pacienteController = new PacienteController;

//Endereços

export { router }