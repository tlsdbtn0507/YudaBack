import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const env = process.env.NODE_ENV;

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: !!process.env.POSTGRES_SYNCHRONIZE,
  ssl: env !== "development",
};
