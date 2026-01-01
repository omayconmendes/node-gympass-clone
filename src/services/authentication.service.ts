import type {UsersRepository} from "@/repositories/users.repository.js";
import {InvalidCredentialsError} from "@/services/errors/invalid-credentials-error.js";
import {compare} from "bcryptjs";
import type {User} from "@prisma/client";


interface AuthenticationServiceRequest {
    email: string
    password: string
}

interface AuthenticationServiceResponse {
    user: User
}

export class AuthenticationService {
    constructor(
        private userRepository: UsersRepository
    ) {}

    async execute({ email, password }: AuthenticationServiceRequest): Promise<AuthenticationServiceResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return { user }
    }
}