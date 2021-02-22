import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    database: process.env.TYPEORM_DATABASE,
    password: process.env.TYPEORM_PASSWORD,
    username: process.env.TYPEORM_USERNAME,
    synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
    entities: [path.resolve(__dirname, '..', process.env.TYPEORM_ENTITIES)],
  }),
);
