import type { FastifyInstance } from "fastify";
import { register } from "@/http/controllers/register.controller.js";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
}