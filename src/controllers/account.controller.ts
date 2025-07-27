import express, { NextFunction } from 'express'
import { AccountService } from '../services/account.service'
import { CreateAccountInfoDto, GetAccountParam } from '../schemas/account.schema'
import { User } from '../entities/user.entity'

export class AccountController {
  private accountService: AccountService
  constructor(accountService: AccountService) {
    this.accountService = accountService
  }

  public createAccount = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const accountInfo = req.body as CreateAccountInfoDto

      const account = await this.accountService.createAccount(req.user as User, accountInfo)

      res.status(201).send(account)
    } catch (error) {
      next(error)
    }
  }

  public getAllAccounts = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const accounts = await this.accountService.getAllAccounts(req.user as User)
      res.status(200).send(accounts)
    } catch (error) {
      next(error)
    }
  }

  public getAccountWithAccountId = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const { accountId } = req.params as GetAccountParam

      const accounts = await this.accountService.getAccountWithAccountId(req.user as User, accountId)
      res.status(200).send(accounts)
    } catch (error) {
      next(error)
    }
  }

  public deleteAccount = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const { accountId } = req.params as GetAccountParam

      await this.accountService.deleteAccount(req.user as User, accountId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
