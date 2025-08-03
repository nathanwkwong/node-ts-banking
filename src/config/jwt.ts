import 'dotenv/config'

export interface JwtPayload {
  id: string
  username: string
}

export interface AccessTokenInfo extends JwtPayload {
  iat: number
  exp: number
}

interface JwtConfig {
  jwtSecret: string
  jwtSession: {
    expiresInSec: string
    session: boolean
  }
}

export const jwtConfig: JwtConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {
    expiresInSec: process.env.JWT_SESSION_EXPIRES_IN_SEC,
    session: false,
  },
}
