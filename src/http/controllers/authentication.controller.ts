import type { FastifyRequest, FastifyReply }  from "fastify"
import {z} from "zod";
import {InvalidCredentialsError} from "@/services/errors/invalid-credentials-error.js";
import {makeAuthenticationService} from "@/services/factories/make-register-service.js";

export async function authentication (request: FastifyRequest, reply: FastifyReply) {
    const authenticationBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticationBodySchema.parse(request.body);

    try {
        const authenticationService = makeAuthenticationService()

        await authenticationService.execute({
            email,
            password
        })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message });
        }
        throw err;
    }

    return reply.status(200).send();
}