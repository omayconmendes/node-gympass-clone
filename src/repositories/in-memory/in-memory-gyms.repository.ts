import { Gym } from "@prisma/client";
import { GymsRepository } from "../gyms.repository.js";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((item) => {
      return item.id === id;
    });

    if (!gym) {
      return null;
    }

    return gym;
  }
}
