import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in.repository.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository.js";
import { CheckInService } from "@/services/check-in.service.js";
import { Decimal } from "@prisma/client/runtime/library.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error.js";

let checkInInMemoryRepository: InMemoryCheckInRepository;
let gymsInMemoryRepository: InMemoryGymsRepository;
let checkInService: CheckInService;

describe("Check-in Service", () => {
  beforeEach(async () => {
    checkInInMemoryRepository = new InMemoryCheckInRepository();
    gymsInMemoryRepository = new InMemoryGymsRepository();
    checkInService = new CheckInService(
      gymsInMemoryRepository,
      checkInInMemoryRepository
    );

    await gymsInMemoryRepository.create({
      id: "gym-01",
      title: "Javascript Gym",
      description: "",
      phone: "",
      latitude: -26.8827966,
      longitude: -49.1041417,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow to make check-in", async () => {
    vi.setSystemTime(new Date(2026, 2, 5, 14, 0, 0));
    const { checkIn } = await checkInService.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -26.8827966,
      userLongitude: -49.1041417,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not allow to make more than one check-in on the same day", async () => {
    vi.setSystemTime(new Date(2026, 2, 5, 17, 0, 0));
    await checkInService.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -26.8827966,
      userLongitude: -49.1041417,
    });

    await expect(() =>
      checkInService.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -26.8827966,
        userLongitude: -49.1041417,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should allow to check-in different days", async () => {
    vi.setSystemTime(new Date(2026, 2, 4, 17, 0, 0));
    await checkInService.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -26.8827966,
      userLongitude: -49.1041417,
    });

    vi.setSystemTime(new Date(2026, 2, 5, 17, 0, 0));
    const { checkIn } = await checkInService.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -26.8827966,
      userLongitude: -49.1041417,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in on distant gyms", async () => {
    gymsInMemoryRepository.items.push({
      id: "gym-02",
      title: "Javascript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-26.8827966),
      longitude: new Decimal(-49.1041417),
    });

    await expect(() =>
      checkInService.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -26.9528864,
        userLongitude: -49.0716105,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
