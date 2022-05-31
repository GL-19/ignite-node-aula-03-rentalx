import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// Trecho de código para rodar no linux, na EC2, com apenas o banco de dados no docker
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

// Trecho para rodar no windows, com o servidor e o banco juntos no docker
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
