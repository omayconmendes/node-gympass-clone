import {beforeEach, describe, expect, it} from 'vitest'
import {CheckInService} from "@/services/check-in.service.js";
import {InMemoryCheckInRepository} from "@/repositories/in-memory/in-memory-check-in.repository.js";

let checkInInMemoryRepository: InMemoryCheckInRepository;
let checkInService: CheckInService;

describe('Check-in Service', () => {

    beforeEach(() => {
        checkInInMemoryRepository = new InMemoryCheckInRepository()
        checkInService = new CheckInService(checkInInMemoryRepository)
    })

    it('should allow to make check-in', async () => {
        const { checkIn } = await checkInService.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String));
    })
})
