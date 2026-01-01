import {PrismaUsersRepository} from "@/repositories/prisma/prisma-users.repository.js";
import {AuthenticationService} from "@/services/authentication.service.js";

export function makeAuthenticationService() {
    const prismaUsersRepository = new PrismaUsersRepository();
    const authenticationService = new AuthenticationService(prismaUsersRepository)

    return authenticationService;
}