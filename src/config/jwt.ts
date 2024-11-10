import 'dotenv/config'

export const jwtConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {
    expiresIn: process.env.JWT_SESSION_EXPIRES_IN,
    session: false,
  },
}
