import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from '../createRental/CreateRentalUseCase';
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

let createRentalUseCase: CreateRentalUseCase;
let devolutionRentalUseCase: DevolutionRentalUseCase;

const dayAdd24Hours = dayjs().add(1, 'day').toDate();

describe('Devolution Rental Use Case', () => {
  beforeAll(() => {
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dateProvider,
      carsRepository
    );

    devolutionRentalUseCase = new DevolutionRentalUseCase(
      rentalsRepository,
      carsRepository,
      dateProvider
    );
  });

  it('Should be able to devolve a rented car', async () => {
    const car = await carsRepository.create({
      name: 'Test Car',
      brand: 'Brand',
      category_id: 'test',
      description: 'Description of test car',
      license_plate: 'AASS-1122',
      daily_rate: 120,
      fine_amount: 60,
    });

    const user_id = '12345';

    const rentalBeforeDevolution = await createRentalUseCase.execute({
      user_id,
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const carBeforeDevolution = await carsRepository.findById(car.id);

    expect(rentalBeforeDevolution.end_date).toBeFalsy();
    expect(carBeforeDevolution.available).toBe(false);

    const { id } = rentalBeforeDevolution;

    const rentalAfterDevolution = await devolutionRentalUseCase.execute({
      id,
    });

    const carAfterDevolution = await carsRepository.findById(car.id);

    expect(rentalAfterDevolution.end_date).toBeTruthy();
    expect(carAfterDevolution.available).toBe(true);
  });

  it('Should not be able to devolve a car that is not rented', async () => {
    await expect(
      devolutionRentalUseCase.execute({
        id: '74589',
      })
    ).rejects.toEqual(new AppError('Rental does not exist!'));
  });
});
