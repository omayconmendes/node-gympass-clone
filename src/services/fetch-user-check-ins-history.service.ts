import type { CheckInRepository } from "@/repositories/check-in.repository.js";
import type { CheckIn } from "@prisma/client";

interface FetchUserCheckInsServiceRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsServiceResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsServiceRequest): Promise<FetchUserCheckInsServiceResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
