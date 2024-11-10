import { UserRepository } from '../repositories/user.repository'
import { UserRegistrationDto } from '../schemas/user.schema'
import { BadRequestException } from '../utils/exceptions/badRequestException'

export class AuthService {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  createUser = async (userData: UserRegistrationDto) => {
    const userWithSameUserName = await this.userRepository.getUserByName(userData.username)
    if (userWithSameUserName) {
      throw new BadRequestException('User name already exists')
    }

    const userWithSameEmail = await this.userRepository.getUserByEmail(userData.email)
    if (userWithSameEmail) {
      throw new BadRequestException('User email already exists')
    }

    return await this.userRepository.createUser(userData)
  }
}
