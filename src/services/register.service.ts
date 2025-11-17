import bcrypt from "bcryptjs"
import type {UsersRepository} from "@/repositories/users.repository.js";
import {UserAlreadyExistsError} from "@/services/errors/user-already-exists-error.js";

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

export class RegisterService {

    constructor(private usersRepository: UsersRepository) {}

    async execute ({name, email, password}: RegisterServiceRequest) {
        const password_hash = await bcrypt.hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        await this.usersRepository.create({
            name,
            email,
            password_hash
        })
    }
}