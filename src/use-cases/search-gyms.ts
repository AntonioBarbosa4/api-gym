import { IGymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface ISearchGymsUseCaseRequest {
  query: string;
  page: number;
}
interface ISearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: ISearchGymsUseCaseRequest): Promise<ISearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
