import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepository: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let car1: Car;
let car2: Car;
let car3: Car;

describe('List Cars', () => {
  beforeEach(async () => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);

    car1 = await carsRepository.create({
      name: 'Car 1',
      description: 'Car Description',
      daily_rate: 160,
      license_plate: 'ABC-1234',
      fine_amount: 90,
      brand: 'Brand 1',
      category_id: 'category 1',
    });

    car2 = await carsRepository.create({
      name: 'Car 2',
      description: 'Car Description',
      daily_rate: 80,
      license_plate: 'HJG-9876',
      fine_amount: 40,
      brand: 'Brand 2',
      category_id: 'category 2',
    });

    car3 = await carsRepository.create({
      name: 'Car 3',
      description: 'Car Description',
      daily_rate: 100,
      license_plate: 'DDD-5555',
      fine_amount: 60,
      brand: 'Brand 3',
      category_id: 'category 3',
    });
  });

  it('should be able to list all available cars', async () => {
    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car1, car2, car3]);
  });

  it('should be able to list all available cars by brand', async () => {
    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Brand 1',
    });

    expect(cars).toEqual([car1]);
  });

  it('should be able to list all available cars by category', async () => {
    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category 2',
    });

    expect(cars).toEqual([car2]);
  });

  it('should be able to list all available cars by name', async () => {
    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car 3',
    });

    expect(cars).toEqual([car3]);
  });
});
