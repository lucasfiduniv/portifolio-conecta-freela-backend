import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  // Configure Winston logger
  const logger = WinstonModule.createLogger({
    transports: [
      // Console com cores e formato amigável
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      }),

      // Logs de erro em arquivo
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // Todos os logs em arquivo
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });

  try {
    const app = await NestFactory.create(AppModule, {
      logger,
    });

    // Habilita CORS
    app.enableCors();

    // Pipes globais para validação
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Swagger docs
    const config = new DocumentBuilder()
      .setTitle('Conecta Freela API')
      .setDescription('API for the Conecta Freela freelancer marketplace')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('projects', 'Project management endpoints')
      .addTag('proposals', 'Proposal management endpoints')
      .addTag('contracts', 'Contract management endpoints')
      .addTag('reviews', 'Review management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3003;
    await app.listen(port);
    logger.log('info', `🚀 Application running on port ${port}`);
  } catch (error) {
    logger.error('❌ Erro ao iniciar a aplicação:', error);
    process.exit(1); // Encerra o processo com erro
  }
}

bootstrap();
