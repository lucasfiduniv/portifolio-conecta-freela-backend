import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const dbSsl = configService.get<string>('DB_SSL') === 'true';

        return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get<string>('DB_USERNAME', 'postgres'),
            password: configService.get<string>('DB_PASSWORD', 'postgres'),
            database: configService.get<string>('DB_NAME', 'conecta_freela'),
            ssl: dbSsl ? { rejectUnauthorized: false } : false,
            synchronize: true,
            autoLoadEntities: true,
            logging: true,
        };
    },
};
