import type { FastifyRequest, FastifyReply }  from "fastify"
import { prisma } from "@/lib/prisma.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import {PrismaUsersRepository} from "@/repositories/prisma/prisma-users.repository.js";
import {RegisterService} from "@/services/register.service.js";

export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const prismaUsersRepository = new PrismaUsersRepository();
        const registerService = new RegisterService(prismaUsersRepository)

        await registerService.execute({
            name,
            email,
            password
        })
    } catch (err) {
        return reply.status(409).send({
            message: err
        })
    }

    return reply.status(201).send();
}