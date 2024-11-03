import { Router } from 'express'
import { AccountService } from '../services/account.service'
import { AccountController } from '../controllers/account.controller'
import { authGuard } from '../middlewares/authGuard'
import { validateRequestBody } from '../middlewares/validationMiddleware'
import { AccountCreationSchema } from '../schemas/account.schema'

export const accountsRouter = Router()

const accountService = new AccountService()
const accountController = new AccountController(accountService)

// route: /accounts
accountsRouter.post('/', authGuard, validateRequestBody(AccountCreationSchema), accountController.createAccount)
accountsRouter.get('/', authGuard, accountController.getAllAccounts)
