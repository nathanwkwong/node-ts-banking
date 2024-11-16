import { faker } from '@faker-js/faker'
import request from 'supertest'
import { routes } from '../constants/routes'
import { UserLoginDto, UserRegistrationDto } from '../schemas/user.schema'
import * as core from 'express-serve-static-core'

const generateValidPassword = () => {
  return faker.internet.password({ length: 8, memorable: false, pattern: /[A-Za-z0-9]/ }) + 'A1!'
}

export const generateValidUser = (): UserRegistrationDto => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: generateValidPassword(),
})

export const generateInvalidUserWithInvalidEmail = (): UserRegistrationDto => ({
  username: faker.internet.username(),
  email: '123456',
  password: generateValidPassword(),
})

export const generateInvalidUserWithInvalidPassword = (): UserRegistrationDto => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: '123456',
})

export const registerUser = async (app: core.Express, user: UserRegistrationDto) => {
  return await request(app).post(routes.auth.register._full).send(user)
}

export const loginUser = async (app: core.Express, user: UserLoginDto) => {
  return await request(app).post(routes.auth.login._full).send(user)
}
