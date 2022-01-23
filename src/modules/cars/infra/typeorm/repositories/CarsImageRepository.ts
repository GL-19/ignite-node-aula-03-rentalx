import { ICarsImageRepository } from '@modules/cars/repositories/ICarsImageRepository';

import { CarImage } from '../entities/CarImage';

class CarsImageRepository implements ICarsImageRepository {
  async create(car_id: string, image_name: string): Promise<CarImage> {
    throw new Error('Method not implemented.');
  }
}
