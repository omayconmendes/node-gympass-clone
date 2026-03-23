import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymService } from "./create-gym.service.js";

let gymsInMemoryRepository: InMemoryGymsRepository;
let createGymService: CreateGymService;

describe("Create Gym Service", () => {
  beforeEach(() => {
    gymsInMemoryRepository = new InMemoryGymsRepository();
    createGymService = new CreateGymService(gymsInMemoryRepository);
  });

  it("should allow to create gym", async () => {
    const { gym } = await createGymService.execute({
      title: "Javascript Gym",
      description: null,
      phone: null,
      latitude: -26.8827966,
      longitude: -49.1041417,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
