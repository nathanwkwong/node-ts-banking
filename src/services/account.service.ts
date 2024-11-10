import { postgresDataSource } from '../config/database'
import { Account } from '../entities/account.entity'
import { User } from '../entities/user.entity'
import { AccountCreationDto } from '../schemas/account.schema'

export class AccountService {
  constructor() {}

  // Accounts with same bank code, account type, currency and user are considered as duplicate
  checkIfTypeAccountExists = async (user: User, accountInfo: AccountCreationDto): Promise<boolean> => {
    const { accountType, currency, bankCode } = accountInfo

    const account = await Account.findOne({
      where: { user: { id: user.id }, accountType, currency, bankCode },
    })

    return !!account
  }

  createAccount = async (user: User, accountInfo: AccountCreationDto) => {
    const { accountType, currency, status, branchCode, bankCode } = accountInfo

    const isAccountExists = await this.checkIfTypeAccountExists(user, accountInfo)
    if (isAccountExists) {
      throw new Error('Account already exists')
    }

    const lastAccount = await postgresDataSource
      .createQueryBuilder()
      .select('account')
      .from(Account, 'account')
      .orderBy('account.accountNumber', 'DESC')
      .getOne()

    const accountNumber = lastAccount ? parseInt(lastAccount.accountNumber) + 1 : 100000000000

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
        branchCode,
        bankCode,
        accountNumber: accountNumber.toString(),
      })
      .execute()
  }

  getAllAccounts = async (user: User): Promise<Account[]> => {
    return await Account.find({
      where: { user: { id: user.id } },
      select: ['id', 'accountNumber', 'balance', 'currency', 'accountType', 'status'],
    })
  }

  getAccountWithAccountId = async (user: User, accountId: string): Promise<Account> => {
    return (
      await Account.find({
        where: { user: { id: user.id }, id: accountId },
        select: ['id', 'accountNumber', 'balance', 'currency', 'accountType', 'status'],
      })
    )[0]
  }

  deleteAccount = async (user: User, accountId: string) => {
    await Account.delete({ id: accountId, user: { id: user.id } })
  }
}
