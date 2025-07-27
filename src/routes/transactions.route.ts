import { Router } from 'express'
import { TransactionService } from '../services/transaction.service'
import { TransactionController } from '../controllers/transaction.controller'
import { routes } from '../constants/routes'
import { authGuard } from '../middlewares/authGuard'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '../middlewares/validationMiddleware'
import {
  AccountDepositSchema,
  AccountHistorySchema,
  AccountIdSchema,
  AccountTransferSchema,
  AccountWithdrawSchema,
} from '../schemas/transaction.schema'

export const transactionsRouter = Router()

const transactionService = new TransactionService()
const transactionController = new TransactionController(transactionService)

// route: /transactions
transactionsRouter.patch(
  routes.transaction.deposit._relative,
  authGuard,
  validateRequestBody(AccountDepositSchema),
  transactionController.deposit
)

transactionsRouter.patch(
  routes.transaction.transfer._relative,
  authGuard,
  validateRequestBody(AccountTransferSchema),
  transactionController.transfer
)

transactionsRouter.patch(
  routes.transaction.withdraw._relative,
  authGuard,
  validateRequestBody(AccountWithdrawSchema),
  transactionController.withdraw
)

transactionsRouter.get(
  routes.transaction.history._relative + '/:accountId',
  authGuard,
  validateRequestParams(AccountIdSchema),
  validateRequestQuery(AccountHistorySchema),
  transactionController.transactionHistory
)
