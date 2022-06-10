import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import { CreateRentalUseCase } from '../createRental/CreateRentalUseCase';
import { DevolutionRentalUseCase } from '../devolutionRental/DevolutionRentalUseCase';
import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

let createRentalUseCase: CreateRentalUseCase;
let devolutionRentalUseCase: DevolutionRentalUseCase;
let listRentalsByUserUseCase: ListRentalsByUserUseCase;

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

    listRentalsByUserUseCase = new ListRentalsByUserUseCase(rentalsRepository);
  });

  it('Should list all user rentals', async () => {
    const car1 = await carsRepository.create({
      name: 'Test Car 1',
      brand: 'Brand 1',
      category_id: 'test',
      description: 'Description of test car 1',
      license_plate: 'AASS-1122',
      daily_rate: 120,
      fine_amount: 60,
    });

    const car2 = await carsRepository.create({
      name: 'Test Car 2',
      brand: 'Brand 1',
      category_id: 'test',
      description: 'Description of test car 2',
      license_plate: 'BBHH-4422',
      daily_rate: 150,
      fine_amount: 75,
    });

    const car3 = await carsRepository.create({
      name: 'Test Car 3',
      brand: 'Brand 2',
      category_id: 'test',
      description: 'Description of test car 3',
      license_plate: 'CCXX-1155',
      daily_rate: 200,
      fine_amount: 100,
    });

    const firstUserId = '12345';
    const secondUserId = '57890';

    const { id } = await createRentalUseCase.execute({
      user_id: firstUserId,
      car_id: car1.id,
      expected_return_date: dayAdd24Hours,
    });

    const firstUserFirstRental = await devolutionRentalUseCase.execute({
      id,
    });

    const firstUserSecondRental = await createRentalUseCase.execute({
      user_id: firstUserId,
      car_id: car2.id,
      expected_return_date: dayAdd24Hours,
    });

    const secondUserFirstRental = await createRentalUseCase.execute({
      user_id: secondUserId,
      car_id: car3.id,
      expected_return_date: dayAdd24Hours,
    });

    const firstUserRentalsList = await listRentalsByUserUseCase.execute(
      firstUserId
    );

    const secondUserRentalsList = await listRentalsByUserUseCase.execute(
      secondUserId
    );

    expect(firstUserRentalsList).toHaveLength(2);
    expect(secondUserRentalsList).toHaveLength(1);

    expect(firstUserRentalsList).toContainEqual(firstUserFirstRental);
    expect(firstUserRentalsList).toContainEqual(firstUserSecondRental);
    expect(secondUserRentalsList).toContainEqual(secondUserFirstRental);
  });
});
