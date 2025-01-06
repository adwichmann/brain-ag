import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { PostgresExceptionFilter } from './utils/filters/postgress-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new PostgresExceptionFilter());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5000'],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: false,
  });
  const themeCss = fs.readFileSync('swagger.theme.css', 'utf8');
  const customOptions: SwaggerCustomOptions = {
    explorer: true,
    customSiteTitle: 'Brain Agriculture API Docs',
    customCss: themeCss,
  };
  const configSwagger = new DocumentBuilder()
    .setTitle('Brain Agriculture')
    .setDescription('The Brain Agriculture API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('api', app, documentFactory, customOptions);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
