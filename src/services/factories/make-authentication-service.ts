import {PrismaUsersRepository} from "@/repositories/prisma/prisma-users.repository.js";
import {RegisterService} from "@/services/register.service.js";

export function makeRegisterService() {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(prismaUsersRepository)

    return registerService;
}