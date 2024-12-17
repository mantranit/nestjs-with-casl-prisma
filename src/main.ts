// src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cors from '@fastify/cors';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  await app.register(cors, {
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('NCPPS')
    .setDescription('The NCPPS API description')
    .setVersion('0.1')
    .addServer('http://localhost:3000/api/', 'Local environment')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
