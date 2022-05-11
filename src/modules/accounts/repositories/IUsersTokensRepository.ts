import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserTokens } from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
  create({
    expiration_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserId(user_id: string): Promise<UserTokens[]>;

  findByRefreshToken(refresh_token: string): Promise<UserTokens>;

  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token
  ): Promise<UserTokens>;

  deleteById(id: string): Promise<void>;
}

export { IUsersTokensRepository };
