import dotenv from "dotenv";
import { app } from "./app";
import logger from "./logger";

dotenv.config();

if (process.env.NODE_ENV !== "test") {
    app.listen(process.env.PORT || 8080, () => logger.info("Funcionando na porta 8080"));
}