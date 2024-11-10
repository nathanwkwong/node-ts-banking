import passport from 'passport'
import passportJWT from 'passport-jwt'
import { jwtConfig } from './jwt'
import { User } from '../entities/user.entity'
import { logger } from '../utils/logger'
import { ErrorCode } from '../constants/errorCodes'

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

export function initPassport() {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: jwtConfig.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findOne({ where: { id: jwtPayload.id } })
          if (user) {
            return done(null, user)
          } else {
            return done(new Error(ErrorCode.USER_NOT_FOUND), null)
          }
        } catch (error) {
          logger.error(error)
          return done(new Error(ErrorCode.JWT_FAILED), null)
        }
      }
    )
  )
}
