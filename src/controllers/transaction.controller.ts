import express, { NextFunction } from 'express'
import { TransactionService } from '../services/transaction.service'
import { AccountDepositDto, AccountWithdrawDto } from '../schemas/transaction.schema'
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

  transfer = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionService.transfer(req.user as User, req.body)
      res.status(201).send(transaction)
    } catch (error) {
      next(error)
    }
  }

  withdraw = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionService.withdraw(req.user as User, req.body as AccountWithdrawDto)
      res.status(201).send(transaction)
    } catch (error) {
      next(error)
    }
  }
}
