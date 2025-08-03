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
    expiresIn: string
    session: boolean
  }
}

export const jwtConfig: JwtConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {
    expiresIn: process.env.JWT_SESSION_EXPIRES_IN,
    session: false,
  },
}
