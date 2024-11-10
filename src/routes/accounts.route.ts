import { Router } from 'express'
import { AccountService } from '../services/account.service'
import { AccountController } from '../controllers/account.controller'
import { authGuard } from '../middlewares/authGuard'
import { validateRequestBody, validateRequestParams } from '../middlewares/validationMiddleware'
import { AccountCreationSchema, GetAccountWithAccountIdSchema } from '../schemas/account.schema'

export const accountsRouter = Router()

const accountService = new AccountService()
const accountController = new AccountController(accountService)

// route: /accounts
accountsRouter.post('/', authGuard, validateRequestBody(AccountCreationSchema), accountController.createAccount)
accountsRouter.get('/', authGuard, accountController.getAllAccounts)
accountsRouter.get(
  '/:accountId',
  authGuard,
  validateRequestParams(GetAccountWithAccountIdSchema),
  accountController.getAccountWithAccountId
)

accountsRouter.delete(
  '/:accountId',
  authGuard,
  validateRequestParams(GetAccountWithAccountIdSchema),
  accountController.deleteAccount
)
