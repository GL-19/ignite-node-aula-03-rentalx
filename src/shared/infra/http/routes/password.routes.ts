import { Router } from 'express';

import { SendForgottenPasswordMailController } from '@modules/accounts/useCases/sendForgottenPasswordEmail/SendForgottenPasswordMailController';

const passwordRoutes = Router();

const sendForgottenPasswordMailController =
  new SendForgottenPasswordMailController();

passwordRoutes.post('/forgotten', sendForgottenPasswordMailController.handle);

export { passwordRoutes };
