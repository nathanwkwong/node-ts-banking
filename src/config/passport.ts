import passport from 'passport'
import passportJWT from 'passport-jwt'
import { AccessTokenInfo, jwtConfig } from './jwt'
import { User } from '../entities/user.entity'
import { logger } from '../utils/logger'
import { ErrorCode } from '../constants/errorCodes'
import { tokenBlacklistService } from '../services/tokenBlacklist.service'

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

export function initPassport() {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: jwtConfig.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
      },
      async (req, accessTokenInfo: AccessTokenInfo, done) => {
        try {
          const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

          const isTokenExpired = accessTokenInfo.exp < Date.now() / 1000
          if (isTokenExpired) {
            return done(new Error(ErrorCode.INVALID_CREDENTIALS), false)
          }

          if (token && tokenBlacklistService.isTokenBlacklisted(token)) {
            return done(new Error(ErrorCode.INVALID_CREDENTIALS), false)
          }

          const user = await User.findOne({ where: { id: accessTokenInfo.id } })
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
