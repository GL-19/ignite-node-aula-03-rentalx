import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// Trecho de código para rodar no EC2
// O comando utilizado é: docker-compose up -d database_ignite

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test '
          ? 'rentalx_test'
          : defaultOptions.database,
    })
  );
};

// Para rodar tanto o servidor quanto o banco de dados no docker, no windows
// utilizar este trecho de código e usar o comando docker-compose up

/* export default async (host = 'database_ignite'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database:
        process.env.NODE_ENV === 'test '
          ? 'rentalx_test'
          : defaultOptions.database,
    })
  );
}; */
