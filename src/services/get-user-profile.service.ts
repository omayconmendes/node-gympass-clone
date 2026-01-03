import type {UsersRepository} from "@/repositories/users.repository.js";
import type {User} from "@prisma/client";
import {ResourceNotFoundError} from "@/services/errors/resource-not-found-error.js";


interface GetUserProfileServiceRequest {
   userId: string
}

interface GetUserProfileServiceResponse {
    user: User
}

export class GetUserProfileService {
    constructor(
        private userRepository: UsersRepository
    ) {}

    async execute({ userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return { user }
    }
}