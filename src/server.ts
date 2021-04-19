import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

if (process.env.NODE_ENV !== "test") {
    app.listen(process.env.PORT || 8080, () => console.log("Funcionando na porta 8080"));
}