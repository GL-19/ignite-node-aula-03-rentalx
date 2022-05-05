import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      ...data,
    });

    this.cars.push(car);
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const carIndex = this.cars.findIndex((car) => car.id === id);
    this.cars[carIndex].available = available;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }

  async findAvailable(
    brand: string,
    category_id: string,
    name: string
  ): Promise<Car[]> {
    return this.cars.filter(
      (car) =>
        car.available === true &&
        (!brand || car.brand === brand) &&
        (!category_id || car.category_id === category_id) &&
        (!name || car.name === name)
    );
  }
}

export { CarsRepositoryInMemory };
