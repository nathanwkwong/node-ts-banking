import { postgresDataSource } from '../config/database'
import { AccountStatus, AccountType } from '../constants/account'
import { AccountCurrency } from '../constants/currency'
import { Account } from '../entities/account.entity'
import { User } from '../entities/user.entity'

export class AccountService {
  constructor() {}

  createAccount = async (
    user: User,
    accountType: AccountType,
    currency: AccountCurrency,
    status: AccountStatus = AccountStatus.ACTIVE
  ) => {
    // TODO: add conditions to check if user already has an account with same currency and same account type

    await postgresDataSource
      .createQueryBuilder()
      .insert()
      .into(Account)
      .values({
        user,
        balance: 0,
        accountType,
        currency,
        status,
      })
      .execute()
  }
}
