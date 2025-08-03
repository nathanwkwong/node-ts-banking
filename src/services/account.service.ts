import { postgresDataSource } from '../config/database'
import { ACCOUNT_NUMBER_BASE } from '../constants/account'
import { AccountCurrency } from '../constants/currency'
import { Account } from '../entities/account.entity'
import { User } from '../entities/user.entity'
import { AccountInfoDto, CreateAccountInfoDto, ModifyAccountStatusDto } from '../schemas/account.schema'
import { BadRequestException } from '../utils/exceptions/badRequestException'
import { AccountAudit } from '../entities/accountAudit.entity'

export class AccountService {
  constructor() {}

  getAccountInfo = async (accountInfo: Partial<AccountInfoDto>, user?: User): Promise<Account> => {
    const { accountType, currency, bankCode, accountNumber } = accountInfo

    const userClause = user ? { user: { id: user.id } } : {}

    const account: Account = await Account.findOne({
      where: { accountType, currency, bankCode, accountNumber, ...userClause },
    })

    return account
  }

  createAccount = async (user: User, accountInfo: CreateAccountInfoDto) => {
    const { accountType, currency, status, branchCode, bankCode } = accountInfo

    const isAccountExists = !!(await this.getAccountInfo(accountInfo, user))
    if (isAccountExists) {
      throw new BadRequestException('Account already exists')
    }

    const lastAccount = await postgresDataSource
      .createQueryBuilder()
      .select('account')
      .from(Account, 'account')
      .orderBy('account.accountNumber', 'DESC')
      .getOne()

    const accountNumber = lastAccount ? parseInt(lastAccount.accountNumber) + 1 : ACCOUNT_NUMBER_BASE

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

  getAccountWithAccountNumber = async (
    user: User,
    accountNumber: string,
    bankCode: string,
    branchCode: string,
    currency: AccountCurrency
  ): Promise<Account> => {
    return await Account.findOne({
      where: { user: { id: user.id }, accountNumber, bankCode, branchCode, currency },
    })
  }

  modifyAccountStatus = async (user: User, accountId: string, modifyAccountInfo: ModifyAccountStatusDto) => {
    return await postgresDataSource.transaction(async (transactionalEntityManager) => {
      const account = await transactionalEntityManager.findOne(Account, {
        where: { id: accountId, user: { id: user.id } },
      })

      const { status, description } = modifyAccountInfo

      if (!account) {
        throw new BadRequestException('Account not found')
      }

      const fromStatus = account.status
      account.status = status

      await transactionalEntityManager.save(account)

      const auditLog = new AccountAudit()
      auditLog.account = account
      auditLog.fromStatus = fromStatus
      auditLog.toStatus = status
      auditLog.changedBy = user
      auditLog.description = description

      await transactionalEntityManager.save(auditLog)

      return account
    })
  }
}
