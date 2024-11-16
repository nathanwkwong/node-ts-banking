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
      console.log('HERE IS: ', response)
      expect(response.status).toBe(201)

      const loginUseRes = await loginUser(app, validUser)

      expect(loginUseRes).toBeDefined()
      expect(loginUseRes.status).toBe(200)
      expect(loginUseRes.body).toHaveProperty('accessToken')
      expect(loginUseRes.body.username).toBe(validUser.username)
    })
  })
})
