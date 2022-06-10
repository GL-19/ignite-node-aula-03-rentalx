import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListRentalsByCarUseCase } from './ListRentalsByCarUseCase';

class ListRentalsByCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { car_id } = request.params;

    const listRentalsByCarUseCase = await container.resolve(
      ListRentalsByCarUseCase
    );

    const rentals = await listRentalsByCarUseCase.execute(car_id);

    return response.json(rentals);
  }
}

export { ListRentalsByCarController };
