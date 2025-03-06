import { PrismaClient } from "@prisma/client";


const prismaSingleton=()=>{
    return new PrismaClient();  
}

type prismaClientSingleton=ReturnType<typeof prismaSingleton>;

const globalForPrisma = globalThis as unknown as {prisma: PrismaClient | undefined};

const prisma = globalForPrisma.prisma ?? prismaSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;