import { faker } from '@faker-js/faker';
export const challengeMock = () => {
  return {
    name: faker.person.fullName(),
  };
};
