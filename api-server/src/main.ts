import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma/prisma.service';
import { LoggerInterceptor, logger } from './logger';
import { ExceptionFilter } from './errors';
//import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger, cors: true });

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[] = []) => {
        return new BadRequestException({
          data: errors.map((error) => ({
            name: error.property,
            value: error.value,
            constraints: error.constraints,
          })),
        });
      },
    }),
  );
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalFilters(new ExceptionFilter());

  // const config = new DocumentBuilder()
  //   .setTitle('API Server')
  //   .setDescription('API Server Document')
  //   .setVersion('1.0')
  //   .addTag('API Server ApIs')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api-doc', app, document);

  await app.listen(3333, () => {
    logger.log('Application is running on http://localhost:3333');
  });
}
bootstrap();
