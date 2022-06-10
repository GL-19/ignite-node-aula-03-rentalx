import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ListRentalsByCarUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute(car_id: string): Promise<Rental[]> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError('Car not found!');
    }

    const rentals = await this.rentalsRepository.findByCar(car_id);

    return rentals;
  }
}

export { ListRentalsByCarUseCase };
