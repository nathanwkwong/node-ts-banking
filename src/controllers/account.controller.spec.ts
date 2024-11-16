import request from 'supertest'
import { TestHelper } from '../__mocks__/dbInstanceHelper'
import { app } from '../app'
import { routes } from '../constants/routes'
import { generateValidUser, loginUser, registerUser } from '../__mocks__/user'
import { AccountCreationDto } from '../schemas/account.schema'
import { AccountStatus, AccountType } from '../constants/account'
import { AccountCurrency } from '../constants/currency'

describe('Account Controller Test', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'dsfsdfsdf'
    await TestHelper.instance.setupTestDB()
  })

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB()
  })

  describe('Create Account', () => {
    it('should create account with a registered user', async () => {
      const user = generateValidUser()
      await registerUser(app, user)
      const userLoginRequest = await loginUser(app, user)

      const accountInfo: AccountCreationDto = {
        username: user.username,
        accountType: AccountType.SAVING,
        currency: AccountCurrency.HKD,
        status: AccountStatus.ACTIVE,
        bankCode: '012',
        branchCode: '039',
      }

      const accountCreateRequest = await request(app)
        .post(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)
        .send(accountInfo)

      expect(accountCreateRequest.status).toBe(201)
    })
  })

  describe('Get All Accounts', () => {
    it('should get all accounts', async () => {})
  })

  describe('Get Account with account id', () => {
    it('should get all accounts', async () => {})
  })

  describe('Delete Account', () => {
    it('should get all accounts', async () => {})
  })
})
