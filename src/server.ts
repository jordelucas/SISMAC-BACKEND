import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

app.listen(8080, () => console.log("Funcionando na porta 8080"));