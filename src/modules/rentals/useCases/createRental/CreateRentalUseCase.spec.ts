import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dayjsDateProvider,
      carsRepository
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepository.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      fine_amount: 40,
      license_plate: 'test',
      category_id: '1234',
      brand: 'brand',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
    expect(rental.user_id).toBe('12345');
    expect(rental.car_id).toBe(car.id);
  });

  it('should not be able to rent a car that is currently rented', async () => {
    const car = await carsRepository.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      fine_amount: 40,
      license_plate: 'test',
      category_id: '1234',
      brand: 'brand',
    });

    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '78910',
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to allow more than one rented car per user', async () => {
    const car = await carsRepository.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      fine_amount: 40,
      license_plate: 'test',
      category_id: '1234',
      brand: 'brand',
    });

    const car2 = await carsRepository.create({
      name: 'Test 2',
      description: 'Car Test 2',
      daily_rate: 120,
      fine_amount: 60,
      license_plate: 'test2',
      category_id: '5678',
      brand: 'brand',
    });

    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '12345',
        car_id: car2.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('User has a rental in progress'));
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    const car = await carsRepository.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      fine_amount: 40,
      license_plate: 'test',
      category_id: '1234',
      brand: 'brand',
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '12345',
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
