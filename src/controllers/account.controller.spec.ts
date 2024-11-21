import request, { Response } from 'supertest'
import { TestHelper } from '../__mocks__/dbInstanceHelper'
import { app } from '../app'
import { routes } from '../constants/routes'
import { generateValidUser, loginUser, registerUser } from '../__mocks__/user'
import { AccountCreationDto } from '../schemas/account.schema'
import { AccountStatus, AccountType } from '../constants/account'
import { AccountCurrency } from '../constants/currency'
import { UserRegistrationDto } from '../schemas/user.schema'

describe('Account Controller Test', () => {
  let userLoginRequest: Response
  let user: UserRegistrationDto

  beforeAll(async () => {
    process.env.JWT_SECRET = 'dsfsdfsdf'
    await TestHelper.instance.setupTestDB()

    // Register a user and login the user
    user = generateValidUser()
    await registerUser(app, user)
    userLoginRequest = await loginUser(app, user)
  })

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB()
  })

  describe('Create Account', () => {
    it('should create account with a registered user', async () => {
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
    it('should get all accounts for a specific user', async () => {
      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(allAccountResponse.status).toBe(200)
      expect(allAccountResponse.body.length).toBeGreaterThan(0)
    })
  })

  describe('Get Account with specific account id with a signed in user', () => {
    it('should get all accounts', async () => {
      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      const targetAccount = allAccountResponse.body[0]

      const singleAccountResponse = await request(app)
        .get(routes.account._full + `/${targetAccount.id}`)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(singleAccountResponse.status).toBe(200)
      expect(singleAccountResponse.body.accountNumber).toEqual(targetAccount.accountNumber)
    })
  })

  describe('Delete Account', () => {
    it('should delete a specific account with a signed in user', async () => {
      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      const targetAccount = allAccountResponse.body[0]

      const deletedAccountResponse = await request(app)
        .delete(routes.account._full + `/${targetAccount.id}`)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(deletedAccountResponse.status).toBe(204)

      const singleAccountResponse = await request(app)
        .get(routes.account._full + `/${targetAccount.id}`)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(singleAccountResponse.status).toBe(200)
      expect(singleAccountResponse.body.accountNumber).toEqual(undefined)
    })
  })
})
