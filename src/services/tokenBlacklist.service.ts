import { logger } from '../utils/logger'

class TokenBlacklistService {
  // TODO: use redis to store blacklisted tokens
  private blacklistedTokens: Set<string> = new Set()

  public addBlackListToken(token: string): void {
    logger.info(`User Logout: added a token to blacklist: ${token.slice(0, 10)}...`)
    this.blacklistedTokens.add(token)
  }

  public isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token)
  }
}

export const tokenBlacklistService = new TokenBlacklistService()
