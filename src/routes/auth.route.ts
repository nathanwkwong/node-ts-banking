import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { AuthService } from '../services/auth.service'
import { validateRequestBody } from '../middlewares/validationMiddleware'
import { UserLoginSchema, UserRegistrationSchema } from '../schemas/user.schema'
import { repository } from '../repositories'
import { routes } from '../constants/routes'
import { authGuard } from '../middlewares/authGuard'

export const authRouter = Router()

const authService = new AuthService(repository.userRepository)
const authController = new AuthController(authService)

authRouter.post(routes.auth.register._relative, validateRequestBody(UserRegistrationSchema), authController.createUser)
authRouter.post(routes.auth.login._relative, validateRequestBody(UserLoginSchema), authController.login)
authRouter.post(routes.auth.logout._relative, authGuard, authController.logout)
