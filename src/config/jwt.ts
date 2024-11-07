import 'dotenv/config'

export const jwtConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {
    expiresIn: '1h',
    session: false,
  },
}
