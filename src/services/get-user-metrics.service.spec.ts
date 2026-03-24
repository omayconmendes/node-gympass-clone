import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics.service.js";

let checkInInMemoryRepository: InMemoryCheckInRepository;
let getUserMetricsService: GetUserMetricsService;

describe("Get User Metrics Service", () => {
  beforeEach(() => {
    checkInInMemoryRepository = new InMemoryCheckInRepository();
    getUserMetricsService = new GetUserMetricsService(
      checkInInMemoryRepository
    );
  });

  it("should allow to get check-ins count from metrics", async () => {
    await checkInInMemoryRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInInMemoryRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkInsCount } = await getUserMetricsService.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
