import { jwtConfig } from '../config/jwt'
import { ErrorCode } from '../constants/errorCodes'
import { UserRepository } from '../repositories/user.repository'
import { UserRegistrationDto } from '../schemas/user.schema'
import { checkPassword, hashPassword } from '../utils/encryption'
import { BadRequestException } from '../utils/exceptions/badRequestException'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { tokenBlacklistService } from './tokenBlacklist.service'

export class AuthService {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  createUser = async (userData: UserRegistrationDto) => {
    const userWithSameUserName = await this.userRepository.getUserByUsername(userData.username)
    if (userWithSameUserName) {
      throw new BadRequestException('User name already exists')
    }

    const userWithSameEmail = await this.userRepository.getUserByEmail(userData.email)
    if (userWithSameEmail) {
      throw new BadRequestException('User email already exists')
    }

    const hashedPassword = await hashPassword(userData.password)

    return await this.userRepository.createUser({ ...userData, password: hashedPassword })
  }

  login = async (username: string, password: string) => {
    const user = await this.userRepository.getUserByUsername(username)

    if (!user) {
      throw new BadRequestException(ErrorCode.INVALID_CREDENTIALS)
    }

    const isPasswordMatch = await checkPassword(password, user.password)

    if (isPasswordMatch === false) {
      throw new BadRequestException(ErrorCode.INVALID_CREDENTIALS)
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
    }

    const accessToken = jwt.sign(payload, jwtConfig.jwtSecret, { expiresIn: jwtConfig.jwtSession.expiresIn })

    return {
      userId: user.id,
      username: user.username,
      accessToken,
    }
  }

  logout = (token: string) => {
    tokenBlacklistService.addBlackListToken(token)
    return {
      message: 'Logged out successfully',
    }
  }
}
