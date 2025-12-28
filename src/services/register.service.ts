import bcrypt from "bcryptjs"
import type {UsersRepository} from "@/repositories/users.repository.js";
import {UserAlreadyExistsError} from "@/services/errors/user-already-exists-error.js";
import type {User} from "@prisma/client";

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

interface RegisterServiceResponse {
    user: User
}

export class RegisterService {

    constructor(private usersRepository: UsersRepository) {}

    async execute ({name, email, password}: RegisterServiceRequest): Promise<RegisterServiceResponse> {
        const password_hash = await bcrypt.hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash
        })

        return { user }
    }
}