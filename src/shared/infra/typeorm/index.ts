import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// Trecho para utilizar no ambiente de produção, em que o servidor não esta no docker
// O comando utilizado é: docker-compose up -d database_ignite redis

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

// Trecho para rodar no ambiente de desenvolvimento, com servidor no docker
// O comando utilizado é: docker-compose up

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
