import passport from 'passport'

export const authGuard = passport.authenticate('jwt', { session: false })
