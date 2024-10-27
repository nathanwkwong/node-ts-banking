import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { UserRepository } from '../repositories/user.repository'
import { AuthService } from '../services/auth.service'
import { validateRequestBody } from '../middlewares/validationMiddleware'
import { userRegistrationSchema } from '../schemas/user.schema'

export const authRouter = Router()

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

authRouter.post('/register', validateRequestBody(userRegistrationSchema), authController.createUser)
