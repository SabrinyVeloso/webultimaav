
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import fs from 'node:fs';

const databaseUrl = new URL(process.env.DATABASE_URL);

const sslEnabled = process.env.DATABASE_SSL === 'true';

if (process.env.NODE_ENV === 'production' && !sslEnabled) {
  throw new Error('DATABASE_SSL=true é obrigatório em produção.');
}

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port) || 3306,
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),

  ...(sslEnabled
    ? {
        ssl: {
          rejectUnauthorized: true,
          ...(process.env.DB_SSL_CA_PATH
            ? {
                ca: fs.readFileSync(process.env.DB_SSL_CA_PATH)
              }
            : {})
        }
      }
    : {})
});

export const prisma = new PrismaClient({ adapter });
