import request, { Response } from 'supertest'
import { TestHelper } from '../__mocks__/dbInstanceHelper'
import { app } from '../app'
import { routes } from '../constants/routes'
import { generateValidUser, loginUser, registerUser } from '../__mocks__/user'
import { CreateAccountInfoDto } from '../schemas/account.schema'
import { AccountStatus, AccountType } from '../constants/account'
import { AccountCurrency } from '../constants/currency'
import { UserRegistrationDto } from '../schemas/user.schema'
import { User } from '../entities/user.entity'
import { ErrorCode } from '../constants/errorCodes'
import { Account } from '../entities/account.entity'
import { getMockAccountId } from '../__mocks__/account'

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
    it('should create account with a registered user and not avoid to create the same type of account twice', async () => {
      const accountInfo: CreateAccountInfoDto = {
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

      const accountCreatedTwiceCreateRequest = await request(app)
        .post(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)
        .send(accountInfo)

      expect(accountCreatedTwiceCreateRequest.status).toBe(400)
      expect(
        (
          accountCreatedTwiceCreateRequest.error as Error & {
            text: string
          }
        ).text
      ).toContain('Account already exists')
    })
  })

  describe('Get All Accounts', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should get 500 status code when get all accounts from internal error', async () => {
      const mockError = new Error('test error')
      const spy = jest.spyOn(Account, 'find').mockRejectedValue(mockError)
      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(allAccountResponse.status).toBe(500)
      spy.mockRestore()
    })

    it('should get 500 status code when get all accounts from internal error from auth guard', async () => {
      const spy = jest.spyOn(User, 'findOne').mockResolvedValue(undefined)

      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(allAccountResponse.status).toBe(500)
      expect(
        (
          allAccountResponse.error as Error & {
            text: string
          }
        ).text
      ).toContain(ErrorCode.USER_NOT_FOUND)

      spy.mockRestore()
    })

    it('should get all accounts for a specific user', async () => {
      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(allAccountResponse.status).toBe(200)
    })

    it('should fail to get all account with an invalid token', async () => {
      const invalidToken = '123123123'

      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${invalidToken}`)

      expect(allAccountResponse.status).toBe(401)
      expect(
        (
          allAccountResponse.error as Error & {
            text: string
          }
        ).text
      ).toContain('Unauthorized')
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

    it('should get 500 status code when get all accounts from internal error', async () => {
      const allAccountResponse = await request(app)
        .get(routes.account._full)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      const targetAccount = allAccountResponse.body[0]

      const mockError = new Error('test error')
      const spy = jest.spyOn(Account, 'find').mockRejectedValue(mockError)

      const singleAccountResponse = await request(app)
        .get(routes.account._full + `/${targetAccount.id}`)
        .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

      expect(singleAccountResponse.status).toBe(500)
      spy.mockRestore()
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

  it('should get 500 status code when get all accounts from internal error', async () => {
    const targetAccount = getMockAccountId()

    const mockError = new Error('test error')
    const spy = jest.spyOn(Account, 'delete').mockRejectedValue(mockError)

    const deletedAccountResponse = await request(app)
      .delete(routes.account._full + `/${targetAccount}`)
      .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

    expect(deletedAccountResponse.status).toBe(500)
    spy.mockRestore()
  })

  it('should get 500 status code when get all accounts from internal error', async () => {
    const mockError = new Error('test error')
    const spy = jest.spyOn(User, 'findOne').mockRejectedValue(mockError)

    const allAccountResponse = await request(app)
      .get(routes.account._full)
      .set('Authorization', `Bearer ${userLoginRequest.body.accessToken}`)

    expect(allAccountResponse.status).toBe(500)
    spy.mockRestore()
  })
})
