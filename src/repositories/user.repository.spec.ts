import { UserRepository } from './user.repository'
import { TestHelper } from '../__mocks__/dbInstanceHelper'
import { User } from '../entities/user.entity'
import { generateValidUser } from '../__mocks__/user'

describe('SampleRepository Test', () => {
  let userRepository: UserRepository

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB()
  })

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB()
  })

  beforeEach(() => {
    const testRepository = TestHelper.instance.getRepo<User>(User)
    userRepository = new UserRepository(testRepository)
  })

  describe('get', () => {
    it('should create a user', async () => {
      const validUser = generateValidUser()

      const userId = await userRepository.createUser(validUser)

      expect(userId).toBeDefined()
    })
  })
})
