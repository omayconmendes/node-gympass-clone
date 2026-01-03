import {beforeEach, describe, expect, it} from 'vitest'
import {InMemoryUsersRepository} from "@/repositories/in-memory/in-memory-users.repository.js";
import {hash} from "bcryptjs";
import {GetUserProfileService} from "@/services/get-user-profile.service.js";
import {ResourceNotFoundError} from "@/services/errors/resource-not-found-error.js";

let userInMemoryRepository: InMemoryUsersRepository;
let getUserProfileService: GetUserProfileService;

describe('Get User Profile Service', () => {

    beforeEach(() => {
        userInMemoryRepository = new InMemoryUsersRepository()
        getUserProfileService = new GetUserProfileService(userInMemoryRepository)
    })

    it('should allow to get user profile', async () => {
        const createdUser = await userInMemoryRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await getUserProfileService.execute({
            userId: createdUser.id
        })

        expect(user.name).toEqual('John Doe');
    })

    it('should not allow to get user profile with wrong id', async () => {
        await expect(() =>
            getUserProfileService.execute({
                userId: 'non-existing-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
