import fastify from "fastify"
import { PrismaClient } from "@prisma/client"

export const app = fastify();

const prisma = new PrismaClient();

prisma.user.create({
    data: {
        name: 123,
        email: 'mayconsouzamendes@gmail.com'
    }
});