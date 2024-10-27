import { UserRepository } from '../repositories/user.repository'
import { InferredUserReg } from '../schemas/user.schema'

export class AuthService {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  createUser = async (userData: InferredUserReg) => {
    return await this.userRepository.createUser(userData)
  }
}
