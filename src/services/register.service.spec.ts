import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository.js";
import {RegisterService} from "@/services/register.service.js";
import {compare} from "bcryptjs";
import {UserAlreadyExistsError} from "@/services/errors/user-already-exists-error.js";

describe('Register Service', () => {

    it('should allow to register', async () => {
        const userInMemoryRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(userInMemoryRepository)

        const { user } = await registerService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String));
    })

    it('should hash user password upon registration', async () => {
        const userInMemoryRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(userInMemoryRepository)

        const { user } = await registerService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

        expect(isPasswordCorrectlyHashed).toBe(true);
    })

    it('should not allow register with same email', async () => {
        const userInMemoryRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(userInMemoryRepository)

        const email = 'johndoe@example.com';

        await registerService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(() => registerService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })
})
