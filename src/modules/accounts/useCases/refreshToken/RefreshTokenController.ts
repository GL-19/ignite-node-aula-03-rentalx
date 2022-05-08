import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    await refreshTokenUseCase.execute(token);

    return response.status(200);
  }
}

export { RefreshTokenController };
