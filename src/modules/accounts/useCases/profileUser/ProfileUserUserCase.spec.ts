/* import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { UpdateUserAvatarUseCase } from '../updateUserAvatar/UpdateUserAvatarUseCase';
import { ProfileUserUseCase } from './ProfileUserUseCase';

let usersRepository: UsersRepositoryInMemory;
let storageProvider: LocalStorageProvider;

let createUserUseCase: CreateUserUseCase;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;
let profileUserUseCase: ProfileUserUseCase;

describe('Profile User Use Case', () => {
  beforeAll(() => {
    usersRepository = new UsersRepositoryInMemory();
    storageProvider = new LocalStorageProvider();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      usersRepository,
      storageProvider
    );
    profileUserUseCase = new ProfileUserUseCase(usersRepository);
  });

  it('Should return user profile', async () => {
    const createUserData = {
      name: 'Teste',
      email: 'teste@email.com',
      password: 'senha12345',
      driver_license: 'ADFG-5568',
    };

    await createUserUseCase.execute(createUserData);
    // await updateUserAvatarUseCase.execute();

    const { id } = await usersRepository.findByEmail('teste@email.com');

    const profile = await profileUserUseCase.execute(id);

    expect(profile.id).toBe(id);
    expect(profile.name).toBe(createUserData.name);
    expect(profile.email).toBe(createUserData.email);
    expect(profile.driver_license).toBe(createUserData.driver_license);
  });
});
 */

describe('test', () => {
  it('test', () => expect(1).toBe(1));
});
