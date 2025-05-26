export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'conecta_freela',
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: process.env.DB_SSL === 'true',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  
  mail: {
    host: process.env.MAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER || 'user@example.com',
      pass: process.env.MAIL_PASS || 'password',
    },
    from: process.env.MAIL_FROM || 'noreply@conectafreela.com',
  },
});