import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms.service.js";

let gymsInMemoryRepository: InMemoryGymsRepository;
let fetchNearbyGymsService: FetchNearbyGymsService;

describe("Fetch Nearby Gyms Service", () => {
  beforeEach(() => {
    gymsInMemoryRepository = new InMemoryGymsRepository();
    fetchNearbyGymsService = new FetchNearbyGymsService(gymsInMemoryRepository);
  });

  it("should allow to fetch nearby gyms", async () => {
    await gymsInMemoryRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -26.8827966,
      longitude: -49.1041417,
    });

    await gymsInMemoryRepository.create({
      title: "Far away Gym",
      description: null,
      phone: null,
      latitude: -26.824085,
      longitude: -49.2745175,
    });

    const { gyms } = await fetchNearbyGymsService.execute({
      userLatitude: -26.8827966,
      userLongitude: -49.1041417,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
