import { entityManager } from '../config/database'
import { AccountStatus } from '../constants/account'
import { TransactionStatus, TransactionType } from '../constants/transaction'
import { Transaction } from '../entities/transaction.entity'
import { User } from '../entities/user.entity'
import { AccountDepositDto, AccountTransferDto } from '../schemas/transaction.schema'
import { TransactionData } from '../types/transaction.interface'
import { AccountService } from './account.service'

export class TransactionService {
  private accountService: AccountService
  constructor() {
    this.accountService = new AccountService()
  }

  public deposit = async (depositUser: User, depositInfo: AccountDepositDto) => {
    const transactionInfo: TransactionData = {
      accountNumber: depositInfo.accountNumber,
      bankCode: depositInfo.bankCode,
      branchCode: depositInfo.branchCode,
      currency: depositInfo.currency,
      amount: depositInfo.amount,
      transactionType: TransactionType.DEPOSIT,
    }
    await this.transaction(depositUser, transactionInfo)
  }

  public withdraw = async (withdrawUser: User, withdrawInfo: AccountDepositDto) => {
    const transactionInfo: TransactionData = {
      accountNumber: withdrawInfo.accountNumber,
      bankCode: withdrawInfo.bankCode,
      branchCode: withdrawInfo.branchCode,
      currency: withdrawInfo.currency,
      amount: withdrawInfo.amount,
      transactionType: TransactionType.WITHDRAW,
    }
    await this.transaction(withdrawUser, transactionInfo)
  }

  private transaction = async (user: User, transactionInfo: TransactionData) => {
    try {
      const { accountNumber, bankCode, branchCode, currency, amount, transactionType } = transactionInfo
      const userAccount = await this.accountService.getAccountWithAccountNumber(
        user,
        accountNumber,
        bankCode,
        branchCode,
        currency
      )

      if (!userAccount) {
        throw new Error('Account not found')
      }

      if (userAccount.status !== AccountStatus.ACTIVE) {
        throw new Error('Account is not active')
      }

      await entityManager.transaction(async (transactionalEntityManager) => {
        // update user account balance
        userAccount.balance += transactionInfo.amount
        await transactionalEntityManager.save(userAccount)

        const signedAmount = transactionType === TransactionType.WITHDRAW ? -amount : amount

        // create transaction history
        const transaction = new Transaction()
        transaction.transactionType = transactionType
        transaction.amount = signedAmount
        transaction.status = TransactionStatus.COMPLETED
        transaction.currency = currency
        transaction.receiver = userAccount
        transaction.sender = userAccount
        transaction.description = 'Deposit money'
        await transactionalEntityManager.save(transaction)
      })
    } catch (error) {
      console.error(error)
    }
  }

  public transfer = async (senderUser: User, transferInfo: AccountTransferDto) => {
    try {
      // check sender account is under senderUser exist
      const transferSenderAccountId = transferInfo.senderAccountId
      const senderAccount = await this.accountService.getAccountWithAccountId(senderUser, transferSenderAccountId)
      if (!senderAccount) {
        throw new Error('Sender account not match')
      }

      // check sender account status as active
      if (senderAccount.status !== AccountStatus.ACTIVE) {
        throw new Error('Sender account is not active')
      }

      // check sender have enough amount
      if (senderAccount.balance < transferInfo.amount) {
        throw new Error('Insufficient balance')
      }
      // check receiver account is exist (mapping with bank code, branch code, account number)
      const accountInfo = {
        accountNumber: transferInfo.receiverAccountNumber,
        bankCode: transferInfo.receiverBankCode,
        branchCode: transferInfo.receiverBranchCode,
        currency: transferInfo.currency,
      }
      const receiverAccount = await this.accountService.getAccountInfo(accountInfo)

      if (!receiverAccount) {
        throw new Error('Receiver account not found')
      }
      // check receiver account status as active
      if (receiverAccount.status !== AccountStatus.ACTIVE) {
        throw new Error('Receiver account is not active')
      }
      // check receiver account currency is same as sender account currency
      if (receiverAccount.currency !== senderAccount.currency) {
        throw new Error('Currency not match')
      }
      // send money to receiver (update sender account balance, update receiver account balance)
      // TODO: verify below the logic from Github Copilot
      // TODO: run local test and pass all success cases
      // await entityManager.transaction(async (transactionalEntityManager) => {
      //   // update sender account balance
      //   senderAccount.balance -= transferInfo.amount
      //   await transactionalEntityManager.save(senderAccount)

      //   // update receiver account balance
      //   receiverAccount.balance += transferInfo.amount
      //   await transactionalEntityManager.save(receiverAccount)
      // })
    } catch (error) {
      console.error(error)
    }
  }
}
