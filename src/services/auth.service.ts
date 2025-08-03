import { jwtConfig } from '../config/jwt'
import { ErrorCode } from '../constants/errorCodes'
import { UserRepository } from '../repositories/user.repository'
import { UserRegistrationDto } from '../schemas/user.schema'
import { checkPassword, hashPassword } from '../utils/encryption'
import { BadRequestException } from '../utils/exceptions/badRequestException'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { tokenBlacklistService } from './tokenBlacklist.service'
import { AuthenticationAuditData, authenticationAuditService } from './authenticationAudit.service'
import { AuthenticationEventType } from '../constants/authenticationEvents'
import { Request } from 'express'
import { User } from '../entities/user.entity'

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

  login = async (username: string, password: string, req: Request) => {
    let user: User | null = null
    let accessToken: string | null = null

    try {
      const loginAttemptAuditData: AuthenticationAuditData = {
        username,
        eventType: AuthenticationEventType.LOGIN_ATTEMPT,
        isSuccess: false,
      }

      await authenticationAuditService.logAuthenticationEvent(req, loginAttemptAuditData)

      user = await this.userRepository.getUserByUsername(username)

      if (!user) {
        const loginFailureAuditData: AuthenticationAuditData = {
          username,
          eventType: AuthenticationEventType.LOGIN_FAILURE,
          isSuccess: false,
          failureReason: 'User not found',
        }
        await authenticationAuditService.logAuthenticationEvent(req, loginFailureAuditData)
        throw new BadRequestException(ErrorCode.INVALID_CREDENTIALS)
      }

      const isPasswordMatch = await checkPassword(password, user.password)

      if (isPasswordMatch === false) {
        await authenticationAuditService.logAuthenticationEvent(req, {
          user,
          username,
          eventType: AuthenticationEventType.LOGIN_FAILURE,
          isSuccess: false,
          failureReason: 'Invalid password',
        })
        throw new BadRequestException(ErrorCode.INVALID_CREDENTIALS)
      }

      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
      }

      accessToken = jwt.sign(payload, jwtConfig.jwtSecret, { expiresIn: jwtConfig.jwtSession.expiresInSec })

      const tokenExpiredAt = new Date(Date.now() + Number(jwtConfig.jwtSession.expiresInSec) * 1000)

      const loginSuccessAuditData: AuthenticationAuditData = {
        user,
        username,
        eventType: AuthenticationEventType.LOGIN_SUCCESS,
        isSuccess: true,
        tokenHash: accessToken,
        tokenExpiredAt,
      }

      await authenticationAuditService.logAuthenticationEvent(req, loginSuccessAuditData)

      return {
        userId: user.id,
        username: user.username,
        accessToken,
      }
    } catch (error) {
      if (error instanceof BadRequestException && error.message === ErrorCode.INVALID_CREDENTIALS) {
        throw error
      } else {
        const loginFailureAuditData: AuthenticationAuditData = {
          user,
          username,
          eventType: AuthenticationEventType.LOGIN_FAILURE,
          isSuccess: false,
          failureReason: 'System error',
        }

        await authenticationAuditService.logAuthenticationEvent(req, loginFailureAuditData)
        throw error
      }
    }
  }

  logout = async (token: string, req: Request, user?: User) => {
    try {
      tokenBlacklistService.addBlackListToken(token)

      const logoutSuccessAuditData: AuthenticationAuditData = {
        user,
        username: user?.username || 'Unknown',
        eventType: AuthenticationEventType.LOGOUT,
        isSuccess: true,
        tokenHash: token,
      }

      await authenticationAuditService.logAuthenticationEvent(req, logoutSuccessAuditData)

      return {
        message: 'Logged out successfully',
      }
    } catch (error) {
      const logoutFailureAuditData: AuthenticationAuditData = {
        user,
        username: user?.username || 'Unknown',
        eventType: AuthenticationEventType.LOGOUT,
        isSuccess: false,
        failureReason: 'Logout failed',
        tokenHash: token,
      }

      await authenticationAuditService.logAuthenticationEvent(req, logoutFailureAuditData)
      throw error
    }
  }
}
