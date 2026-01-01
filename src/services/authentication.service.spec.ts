import {expect, describe, it, beforeEach} from 'vitest'
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository.js";
import { AuthenticationService } from "@/services/authentication.service.js";
import { hash } from "bcryptjs";
import {InvalidCredentialsError} from "@/services/errors/invalid-credentials-error.js";

let userInMemoryRepository: InMemoryUsersRepository;
let authenticationService: AuthenticationService;

describe('Authentication Service', () => {

    beforeEach(() => {
        userInMemoryRepository = new InMemoryUsersRepository()
        authenticationService = new AuthenticationService(userInMemoryRepository)
    })

    it('should allow to authenticate', async () => {
        await userInMemoryRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await authenticationService.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String));
    })

    it('should not allow to authenticate with wrong email', async () => {
        await expect(() =>
            authenticationService.execute({
                email: 'example@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not allow to authenticate with wrong password', async () => {
        await userInMemoryRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() =>
            authenticationService.execute({
                email: 'example@example.com',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
