import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { AuthService } from '../services/auth.service'
import { validateRequestBody } from '../middlewares/validationMiddleware'
import { UserLoginSchema, UserRegistrationSchema } from '../schemas/user.schema'
import { repository } from '../repositories'

export const authRouter = Router()

const authService = new AuthService(repository.userRepository)
const authController = new AuthController(authService)

// route: /auth
authRouter.post('/register', validateRequestBody(UserRegistrationSchema), authController.createUser)
authRouter.post('/login', validateRequestBody(UserLoginSchema), authController.login)
