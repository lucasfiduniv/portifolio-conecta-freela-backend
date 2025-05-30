import { ConfigService } from '@nestjs/config';

export const bullMqConfig = {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        return {
            connection: {
                host: configService.get<string>('REDIS_HOST', 'localhost'),
                port: configService.get<number>('REDIS_PORT', 6379),
                password: configService.get<string>('REDIS_PASSWORD', '') || undefined,
            },
        };
    },
};
