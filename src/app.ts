import 'reflect-metadata';
import express from 'express';
import createConnection from "./database";
import { router } from './routes';
import cors from 'cors';
import { Client } from 'pg';

createConnection();

const app = express();
if (process.env.LOCAL_ENV == "production") {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    client.connect();
}

app.use(cors())
app.use(express.json());
app.use(router);

export { app }