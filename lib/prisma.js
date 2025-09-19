import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Setup Neon for WebSocket + fetch (Edge environments ke liye)
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });

// Avoid creating multiple instances during hot-reload (development mode)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma;

export default prisma;
