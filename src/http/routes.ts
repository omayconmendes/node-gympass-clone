import { authentication } from "@/http/controllers/authentication.controller.js";
import { register } from "@/http/controllers/register.controller.js";
import type { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authentication);
}
