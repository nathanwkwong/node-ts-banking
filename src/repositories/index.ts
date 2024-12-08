import { postgresDataSource } from '../config/database'
import { User } from '../entities/user.entity'
import { UserRepository } from './user.repository'

class Repository {
  public userRepository: UserRepository

  constructor() {
    const userRepo = postgresDataSource.getRepository(User)
    this.userRepository = new UserRepository(userRepo)
  }
}

export const repository = new Repository()
