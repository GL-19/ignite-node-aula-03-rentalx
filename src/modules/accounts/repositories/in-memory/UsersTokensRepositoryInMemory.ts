import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens';

import { IUsersTokensRepository } from '../IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = [];

  async create({
    expiration_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      expiration_date,
      refresh_token,
      user_id,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByUserId(user_id: string): Promise<UserTokens[]> {
    const userTokens = this.usersTokens.filter(
      (userToken) => userToken.user_id === user_id
    );

    return userTokens;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (userToken) => userToken.refresh_token === refresh_token
    );

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: any
  ): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (userToken) =>
        userToken.refresh_token === refresh_token &&
        userToken.user_id === user_id
    );

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    this.usersTokens = this.usersTokens.filter(
      (userToken) => userToken.id !== id
    );
  }
}

export { UsersTokensRepositoryInMemory };
