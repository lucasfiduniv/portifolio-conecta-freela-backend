import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { logger } from './config/logger.config';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { logger });

    app.enableCors();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log('info', `🚀 Application running on port ${port}`);
  } catch (error) {
    logger.error('❌ Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap();
