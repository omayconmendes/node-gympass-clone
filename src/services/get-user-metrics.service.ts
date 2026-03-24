import type { CheckInRepository } from "@/repositories/check-in.repository.js";

interface GetUserMetricsServiceRequest {
  userId: string;
}

interface GetUserMetricsServiceResponse {
  checkInsCount: number;
}

export class GetUserMetricsService {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId);

    return { checkInsCount };
  }
}
