import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
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
