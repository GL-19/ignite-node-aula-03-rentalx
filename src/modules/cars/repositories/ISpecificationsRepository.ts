import { Specification } from '../model/Specification';

interface ICreateSpecificatonDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ICreateSpecificatonDTO): void;
  findByName(name: string): Specification;
}

export { ISpecificationsRepository, ICreateSpecificatonDTO };
