import express, { NextFunction } from 'express'
import { AccountService } from '../services/account.service'
import { AccountCreationDto } from '../schemas/account.schema'
import { User } from '../entities/user.entity'

export class AccountController {
  private accountService: AccountService
  constructor(accountService: AccountService) {
    this.accountService = accountService
  }

  createAccount = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const { accountType, currency, status } = req.body as AccountCreationDto

      const account = await this.accountService.createAccount(req.user as User, accountType, currency, status)

      res.status(201).send(account)
    } catch (error) {
      next(error)
    }
  }

  getAllAccounts = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const accounts = await this.accountService.getAllAccounts(req.user as User)
      res.status(200).send(accounts)
    } catch (error) {
      next(error)
    }
  }
}
