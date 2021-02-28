import 'reflect-metadata';
import express from 'express';
import "./database";

const app = express();

app.listen(8080, () => console.log("Funcionando na porta 8080"));