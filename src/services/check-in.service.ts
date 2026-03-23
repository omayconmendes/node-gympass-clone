import type { CheckInRepository } from "@/repositories/check-in.repository.js";
import { GymsRepository } from "@/repositories/gyms.repository.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";
import type { CheckIn } from "@prisma/client";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private gymsRepository: GymsRepository,
    private checkInRepository: CheckInRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // calculate distance between user and gym
    const MAX_DISTANCE_IN_KILOMETERS = 0.1;
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
