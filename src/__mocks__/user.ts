import { faker } from '@faker-js/faker'

const generateValidPassword = () => {
  return faker.internet.password({ length: 8, memorable: false, pattern: /[A-Za-z0-9]/ }) + 'A1!'
}

export const generateValidUser = () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: generateValidPassword(),
})

export const generateInvalidUserWithInvalidEmail = () => ({
  username: faker.internet.username(),
  email: '123456',
  password: generateValidPassword(),
})

export const generateInvalidUserWithInvalidPassword = () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: '123456',
})
