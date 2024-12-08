import request from 'supertest'
import { TestHelper } from '../__mocks__/dbInstanceHelper'
import { app } from '../app'
import { routes } from '../constants/routes'
import {
  generateInvalidUserWithInvalidPassword,
  generateInvalidUserWithInvalidEmail,
  generateValidUser,
  registerUser,
  loginUser,
} from '../__mocks__/user'
import { UserRegistrationDto } from '../schemas/user.schema'

// TODO: set up global jest config, global.ts, e.g. env
let validUser: UserRegistrationDto

describe('Auth Controller Test', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'dsfsdfsdf'
    await TestHelper.instance.setupTestDB()
  })

  beforeEach(async () => {
    validUser = generateValidUser()
  })

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB()
  })

  describe('create user', () => {
    it('should create a user successfully', async () => {
      const response = await registerUser(app, validUser)

      expect(response).toBeDefined()
      expect(response.status).toBe(201)
    })

    it('should not create the same user with the same useranme', async () => {
      await registerUser(app, validUser)

      const validUserWithSameName: UserRegistrationDto = { ...generateValidUser(), username: validUser.username }
      const response = await registerUser(app, validUserWithSameName)

      expect(response).toBeDefined()
      expect(response.status).toBe(400)

      expect(
        (
          response.error as Error & {
            text: string
          }
        ).text
      ).toContain('User name already exists')
    })

    it('should not create the same user with the same email', async () => {
      await registerUser(app, validUser)
      const validUserWithSameEmail: UserRegistrationDto = { ...generateValidUser(), email: validUser.email }
      const response = await registerUser(app, validUserWithSameEmail)

      expect(response).toBeDefined()
      expect(response.status).toBe(400)

      expect(
        (
          response.error as Error & {
            text: string
          }
        ).text
      ).toContain('User email already exists')
    })

    it('should not create a user with invalid email successfully', async () => {
      const response = await request(app).post(routes.auth.register._full).send(generateInvalidUserWithInvalidEmail())

      expect(response).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should not create a user with invalid password successfully', async () => {
      const response = await request(app)
        .post(routes.auth.register._full)
        .send(generateInvalidUserWithInvalidPassword())

      expect(response).toBeDefined()
      expect(response.status).toBe(400)
    })
  })

  describe('login', () => {
    it('should login a user', async () => {
      const response = await registerUser(app, validUser)

      expect(response).toBeDefined()
      expect(response.status).toBe(201)

      const loginUseRes = await loginUser(app, validUser)

      expect(loginUseRes).toBeDefined()
      expect(loginUseRes.status).toBe(200)
      expect(loginUseRes.body).toHaveProperty('accessToken')
      expect(loginUseRes.body.username).toBe(validUser.username)
    })

    it('should login fail for a user with wrong password', async () => {
      const response = await registerUser(app, validUser)

      expect(response).toBeDefined()
      expect(response.status).toBe(201)

      const loginUseRes = await loginUser(app, { ...validUser, password: 'wrongpassword' })

      expect(loginUseRes).toBeDefined()
      expect(loginUseRes.status).toBe(400)

      expect(
        (
          loginUseRes.error as Error & {
            text: string
          }
        ).text
      ).toContain('BadRequestException: AUTH_003')
    })

    it('should login fail for a username that is not in the database', async () => {
      const loginUseRes = await loginUser(app, { username: 'IMPOSSIBLE_USER', password: 'wrongpassword' })

      expect(loginUseRes).toBeDefined()
      expect(loginUseRes.status).toBe(400)

      expect(
        (
          loginUseRes.error as Error & {
            text: string
          }
        ).text
      ).toContain('BadRequestException: AUTH_003')
    })
  })
})
