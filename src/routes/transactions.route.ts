import { Router } from 'express'
import { TransactionService } from '../services/transaction.service'
import { TransactionController } from '../controllers/transaction.controller'

export const transactionsRouter = Router()

const transactionService = new TransactionService()
const transactionController = new TransactionController(transactionService)

// route: /transactions
transactionsRouter.post('/deposit', transactionController.deposit)
// transactionsRouter.post('/withdraw', transactionController.withdraw)
// transactionsRouter.post('/transfer', transactionController.transfer)
// transactionsRouter.get('/history', transactionController.getHistory)
