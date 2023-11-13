import { DB } from '@/generated/types';
import { neonConfig } from '@neondatabase/serverless';

import { Kysely } from 'kysely';
import { NeonDialect } from 'kysely-neon';

if (process.env.POSTGRES_USE_WS_PROXY) {
    // Set the WebSocket proxy to work with the local instance
    neonConfig.wsProxy = (host) => `${host}:5433/v1`;
    // Disable all authentication and encryption
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
}

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set');
}

export const db = new Kysely<DB>({
    dialect: new NeonDialect({
        connectionString: process.env.POSTGRES_URL
    })
});
