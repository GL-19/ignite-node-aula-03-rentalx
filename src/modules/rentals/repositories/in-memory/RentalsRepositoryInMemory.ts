import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  private rentals: Rental[] = [];

  async create({
    id,
    car_id,
    user_id,
    expected_return_date,
    end_date = null,
    total = null,
  }: ICreateRentalDTO): Promise<Rental> {
    const rentalIndex = this.rentals.findIndex((rental) => rental.id === id);

    if (rentalIndex === -1) {
      const rental = new Rental();

      Object.assign(rental, {
        car_id,
        user_id,
        expected_return_date,
        start_date: new Date(),
        total,
        end_date,
      });

      this.rentals.push(rental);

      return rental;
    }

    this.rentals[rentalIndex] = {
      ...this.rentals[rentalIndex],
      end_date,
      total,
    };

    return this.rentals[rentalIndex];
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    return this.rentals.filter((rental) => rental.user_id === user_id);
  }

  async findById(id: string): Promise<Rental> {
    return this.rentals.find((rental) => rental.id === id);
  }
}

export { RentalsRepositoryInMemory };
