import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: !!process.env.POSTGRES_SYNCHRONIZE,
  ssl:true
  // ... process.env.NODE_ENV === 'production' && sslConfig  
}

console.log(typeORMConfig)