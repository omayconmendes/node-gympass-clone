import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsService } from "./search-gyms.service.js";

let gymsInMemoryRepository: InMemoryGymsRepository;
let searchGymsService: SearchGymsService;

describe("Search Gyms Service", () => {
  beforeEach(() => {
    gymsInMemoryRepository = new InMemoryGymsRepository();
    searchGymsService = new SearchGymsService(gymsInMemoryRepository);
  });

  it("should allow to search gyms", async () => {
    await gymsInMemoryRepository.create({
      title: "Javascript Gym",
      description: null,
      phone: null,
      latitude: -26.8827966,
      longitude: -49.1041417,
    });

    await gymsInMemoryRepository.create({
      title: "Typescript Gym",
      description: null,
      phone: null,
      latitude: -26.8827966,
      longitude: -49.1041417,
    });

    const { gyms } = await searchGymsService.execute({
      query: "Javascript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Javascript Gym" })]);
  });

  it("should allow to fetch paginated gyms service", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsInMemoryRepository.create({
        title: `Javascript Gym ${i}`,
        description: `Academia ${i}`,
        phone: null,
        latitude: -26.8827966,
        longitude: -49.1041417,
      });
    }

    const { gyms } = await searchGymsService.execute({
      query: "Javascript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym 21" }),
      expect.objectContaining({ title: "Javascript Gym 22" }),
    ]);
  });
});
