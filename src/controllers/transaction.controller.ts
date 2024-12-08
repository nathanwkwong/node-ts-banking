import express, { NextFunction } from 'express'
import { TransactionService } from '../services/transaction.service'
import { AccountDepositDto } from '../schemas/transaction.schema'
import { User } from '../entities/user.entity'

export class TransactionController {
  private transactionService: TransactionService
  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService
  }

  deposit = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionService.deposit(req.user as User, req.body as AccountDepositDto)
      res.status(201).send(transaction)
    } catch (error) {
      next(error)
    }
  }
}
