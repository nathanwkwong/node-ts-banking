import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from '../entities/user.entity';

export const postgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: ['./src/db/migrations/*.entity{.ts,.js}'],
    logging: true,
    synchronize: true
});
