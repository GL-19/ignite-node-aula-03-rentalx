import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgottenPasswordMailUseCase } from './SendForgottenPasswordMailUseCase';

let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

let sendForgottenPasswordMailUseCase: SendForgottenPasswordMailUseCase;

describe('Send Forgotten Password Mail', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgottenPasswordMailUseCase = new SendForgottenPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it('should be able to send a forgotten password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepository.create({
      name: 'Test Name',
      email: 'test@email.com',
      password: '12345',
      driver_license: '664578',
    });

    await sendForgottenPasswordMailUseCase.execute('test@email.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exist', async () => {
    await expect(
      sendForgottenPasswordMailUseCase.execute('notamail@email.com')
    ).rejects.toEqual(new AppError('User does not exist!'));
  });

  it('should be able to create an user token', async () => {
    const createTokenMail = jest.spyOn(usersTokensRepository, 'create');

    await usersRepository.create({
      name: 'Test Name 2',
      email: 'test2@mail.com',
      password: '67890',
      driver_license: '775542',
    });

    await sendForgottenPasswordMailUseCase.execute('test2@mail.com');

    expect(createTokenMail).toHaveBeenCalled();
  });
});
