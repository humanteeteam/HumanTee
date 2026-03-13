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
    entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../migrations/**/*{.ts,.js}')],
    synchronize: true, // Disabled to use migrations instead
    logging: process.env.NODE_ENV === 'development',
    // PERFORMANCE: Connection pooling
    extra: {
        max: 20, // Maximum pool size (default: 10)
        min: 5,  // Minimum pool size
        idleTimeoutMillis: 30000, // Close idle connections after 30s
        connectionTimeoutMillis: 5000, // Fail if can't get connection in 5s
        // CRITICAL: Query timeouts prevent slow queries from blocking
        statement_timeout: 10000, // Kill queries running >10s
        query_timeout: 10000, // Same as statement_timeout
    },
});
