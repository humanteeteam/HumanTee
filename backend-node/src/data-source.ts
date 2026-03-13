import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

// Support both DATABASE_URL (production) and individual vars (local dev)
const getDatabaseConfig = () => {
    if (process.env.DATABASE_URL) {
        return {
            type: 'postgres' as const,
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Required for Neon
        };
    }

    return {
        type: 'postgres' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'Jithu459@',
        database: process.env.DB_DATABASE || 'HumanTee',
    };
};

export const AppDataSource = new DataSource({
    ...getDatabaseConfig(),
    entities: [__dirname + '/**/*.entity.js'],
    migrations: [join(__dirname, '/../migrations/**/*.js')],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    extra: {
        max: 20,
        min: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        statement_timeout: 10000,
        query_timeout: 10000,
    },
});
