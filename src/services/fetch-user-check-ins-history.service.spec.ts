import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryService } from "./fetch-user-check-ins-history.service.js";

let checkInInMemoryRepository: InMemoryCheckInRepository;
let fetchUserCheckInsService: FetchUserCheckInsHistoryService;

describe("Fetch User Check-ins History Service", () => {
  beforeEach(() => {
    checkInInMemoryRepository = new InMemoryCheckInRepository();
    fetchUserCheckInsService = new FetchUserCheckInsHistoryService(
      checkInInMemoryRepository
    );
  });

  it("should allow to fetch check-in history", async () => {
    await checkInInMemoryRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInInMemoryRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await fetchUserCheckInsService.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should allow to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInInMemoryRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await fetchUserCheckInsService.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
