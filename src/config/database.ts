import { DataSource } from 'typeorm'
import 'dotenv/config'

export const postgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
  logging: true,
  synchronize: false,
})

export const entityManager = postgresDataSource.manager
