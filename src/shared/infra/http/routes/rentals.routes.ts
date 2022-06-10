import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByCarController } from '@modules/rentals/useCases/listRentalsByCar/ListRentalsByCarController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();
const listRentalsByCarController = new ListRentalsByCarController();

rentalsRoutes.post('/', ensureAuthenticated, createRentalController.handle);

rentalsRoutes.get(
  '/user',
  ensureAuthenticated,
  listRentalsByUserController.handle
);

rentalsRoutes.get(
  '/cars/:car_id',
  ensureAuthenticated,
  ensureAdmin,
  listRentalsByCarController.handle
);

rentalsRoutes.post(
  '/devolution/:id',
  ensureAuthenticated,
  devolutionRentalController.handle
);

export { rentalsRoutes };
