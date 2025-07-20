import { Router } from 'express'
import { TransactionService } from '../services/transaction.service'
import { TransactionController } from '../controllers/transaction.controller'
import { routes } from '../constants/routes'
import { authGuard } from '../middlewares/authGuard'
import { validateRequestBody } from '../middlewares/validationMiddleware'
import { AccountDepositSchema, AccountTransferSchema } from '../schemas/transaction.schema'

export const transactionsRouter = Router()

const transactionService = new TransactionService()
const transactionController = new TransactionController(transactionService)

// route: /transactions
transactionsRouter.post(
  routes.transaction.deposit._relative,
  authGuard,
  validateRequestBody(AccountDepositSchema),
  transactionController.deposit
)
transactionsRouter.post(
  routes.transaction.transfer._relative,
  authGuard,
  validateRequestBody(AccountTransferSchema),
  transactionController.transfer
)
// transactionsRouter.post('/withdraw', transactionController.withdraw)
// transactionsRouter.get('/history', transactionController.getHistory)
