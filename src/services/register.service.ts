import bcrypt from "bcryptjs"
import type {UsersRepository} from "@/repositories/users.repository.js";

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
            throw new Error("Email already exist.")
        }

        await this.usersRepository.create({
            nome: name,
            email,
            password_hash
        })
    }
}