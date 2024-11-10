import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { UserRepository } from '../repositories/user.repository'
import { AuthService } from '../services/auth.service'
import { validateRequestBody } from '../middlewares/validationMiddleware'
import { UserRegistrationSchema } from '../schemas/user.schema'

// forward requests to appropriate controller functions
export const authRouter = Router()

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

authRouter.post('/register', validateRequestBody(UserRegistrationSchema), authController.createUser)
