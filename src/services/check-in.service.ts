import type {CheckIn} from "@prisma/client";
import type {CheckInRepository} from "@/repositories/check-in.repository.js";


interface CheckInServiceRequest {
    userId: string
    gymId: string
}

interface CheckInServiceResponse {
    checkIn: CheckIn
}

export class CheckInService {
    constructor( private checkInRepository: CheckInRepository ) {}

    async execute({ userId, gymId }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return { checkIn }
    }
}