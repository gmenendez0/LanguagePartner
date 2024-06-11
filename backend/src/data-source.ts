import "reflect-metadata";
import { DataSource } from "typeorm";
import { LP_User } from './entity/User/LP_User';
import { Language } from './entity/Language/Language';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [LP_User, Language],
    migrations: ['./src/migration/*.ts'],
    subscribers: [],
});