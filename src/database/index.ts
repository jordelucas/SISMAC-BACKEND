import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions(process.env.NODE_ENV);

    return createConnection({ ...defaultOptions, name: "default" });
}