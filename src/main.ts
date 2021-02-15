import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, description, version } = require('../package.json');

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);
}

function setupValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
}

async function initServer(app: INestApplication) {
  const configService = app.get(ConfigService);

  const { port } = configService.get('app');

  const logger = new Logger('NestApplication');

  await app.startAllMicroservicesAsync();

  await app.listen(port, () =>
    logger.log(`Server is listening on port: ${port}`),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupValidationPipe(app);
  setupSwagger(app);

  await initServer(app);
}
bootstrap();
