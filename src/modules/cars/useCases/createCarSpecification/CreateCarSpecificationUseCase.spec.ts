import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepository: CarsRepositoryInMemory;
let specificationsRepository: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();

    specificationsRepository = new SpecificationsRepositoryInMemory();

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepository,
      specificationsRepository
    );
  });

  it('should not be able to add a specification to nonexistent car', async () => {
    const car_id = '1234';
    const specifications_id = ['5678'];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError('Car does not exists!'));
  });

  it('should be able to add a new specification to existing car', async () => {
    const car = await carsRepository.create({
      name: 'Car',
      description: 'Car Description',
      daily_rate: 160,
      license_plate: 'ABC-1234',
      fine_amount: 90,
      brand: 'Brand',
      category_id: 'Category',
    });

    const specification = await specificationsRepository.create({
      name: 'test',
      description: 'test',
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
    expect(specificationsCars.specifications[0].name).toBe('test');
    expect(specificationsCars.specifications[0].description).toBe('test');
  });
});
