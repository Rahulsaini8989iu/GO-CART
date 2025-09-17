import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// WebSocket setup for Node.js
neonConfig.webSocketConstructor = ws;

// Enable querying via fetch for Edge environments
neonConfig.poolQueryViaFetch = true;

// TypeScript global prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Ensure DATABASE_URL exists
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set in environment");

// Create Prisma Client (Neon + Edge safe)
const prisma = global.prisma ?? new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

// Hot reload safe in development
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
