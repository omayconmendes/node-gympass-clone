import {prisma} from "@/lib/prisma.js";
import bcrypt from "bcryptjs"

interface RegisterService {
    name: string
    email: string
    password: string
}

export async function registerService({name, email, password}: RegisterService) {
    const password_hash = await bcrypt.hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (userWithSameEmail) {
        throw new Error("Email already exist.")
    }

    await prisma.user.create({
        data: {
            nome: name,
            email,
            password_hash
        }
    });
}