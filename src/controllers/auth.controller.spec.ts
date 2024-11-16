import request from 'supertest'
import { TestHelper } from '../__mocks__/dbInstanceHelper'
import { app } from '../app'
import { baseRoutePaths } from '../constants/routes'
import {
  generateInvalidUserWithInvalidPassword,
  generateInvalidUserWithInvalidEmail,
  generateValidUser,
} from '../__mocks__/user'

describe('AuthController Test', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'dsfsdfsdf'
    await TestHelper.instance.setupTestDB()
  })

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB()
  })

  describe('AuthController.createUser', () => {
    it('should create a user successfully', async () => {
      const response = await request(app)
        .post(baseRoutePaths.AUTH + '/register')
        .send(generateValidUser())

      expect(response).toBeDefined()
      expect(response.status).toBe(201)
    })

    it('should not create a user with invalid email successfully', async () => {
      const response = await request(app)
        .post(baseRoutePaths.AUTH + '/register')
        .send(generateInvalidUserWithInvalidEmail())

      expect(response).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should not create a user with invalid password successfully', async () => {
      const response = await request(app)
        .post(baseRoutePaths.AUTH + '/register')
        .send(generateInvalidUserWithInvalidPassword())

      expect(response).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should login a user', async () => {
      const validUser = generateValidUser()

      const response = await request(app)
        .post(baseRoutePaths.AUTH + '/register')
        .send(validUser)

      expect(response).toBeDefined()
      expect(response.status).toBe(201)

      const loginUseRes = await request(app)
        .post(baseRoutePaths.AUTH + '/login')
        .send({
          username: validUser.username,
          password: validUser.password,
        })

      expect(loginUseRes).toBeDefined()
      expect(loginUseRes.status).toBe(200)
      expect(loginUseRes.body).toHaveProperty('accessToken')
      expect(loginUseRes.body.username).toBe(validUser.username)
    })
  })
})
