import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import { CreateRentalUseCase } from '../createRental/CreateRentalUseCase';
import { DevolutionRentalUseCase } from '../devolutionRental/DevolutionRentalUseCase';
import { ListRentalsByCarUseCase } from './ListRentalsByCarUseCase';

let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

let createRentalUseCase: CreateRentalUseCase;
let devolutionRentalUseCase: DevolutionRentalUseCase;
let listRentalsByCarUseCase: ListRentalsByCarUseCase;

const dayAdd24Hours = dayjs().add(1, 'day').toDate();

describe('List Rentals By User', () => {
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

    listRentalsByCarUseCase = new ListRentalsByCarUseCase(rentalsRepository);
  });

  it('Should list all rentals of a car', async () => {
    const car = await carsRepository.create({
      name: 'Test Car 1',
      brand: 'Brand 1',
      category_id: 'test',
      description: 'Description of test car 1',
      license_plate: 'AASS-1122',
      daily_rate: 120,
      fine_amount: 60,
    });

    const anotherCar = await carsRepository.create({
      name: 'Test Car 2',
      brand: 'Brand 1',
      category_id: 'test',
      description: 'Description of test car 2',
      license_plate: 'BBHH-4422',
      daily_rate: 150,
      fine_amount: 75,
    });

    const { id: firstRental_id } = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const firstRental = await devolutionRentalUseCase.execute({
      id: firstRental_id,
    });

    const { id: secondRental_id } = await createRentalUseCase.execute({
      user_id: '5489',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const secondRental = await devolutionRentalUseCase.execute({
      id: secondRental_id,
    });

    const thirdRental = await createRentalUseCase.execute({
      user_id: '2496',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const anotherCarRental = await createRentalUseCase.execute({
      user_id: '3256',
      car_id: anotherCar.id,
      expected_return_date: dayAdd24Hours,
    });

    const rentals = await listRentalsByCarUseCase.execute(car.id);

    expect(rentals).toHaveLength(3);
    expect(rentals).toContainEqual(firstRental);
    expect(rentals).toContainEqual(secondRental);
    expect(rentals).toContainEqual(thirdRental);
    expect(rentals).not.toContainEqual(anotherCarRental);
  });

  it('Should return empty array if car has not been rented', async () => {
    const rentals = await listRentalsByCarUseCase.execute('0000');

    expect(rentals).toHaveLength(0);
  });
});
