import { UserRepository } from './user.repository'

class Repository {
  public userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }
}

export const repository = new Repository()
