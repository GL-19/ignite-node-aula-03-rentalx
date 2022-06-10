import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

@injectable()
class ListRentalsByCarUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository
  ) {}

  async execute(car_id: string): Promise<Rental[]> {
    const rentals = await this.rentalsRepository.findByCar(car_id);

    return rentals;
  }
}

export { ListRentalsByCarUseCase };
