import { entityManager } from '../config/database'
import { AccountStatus } from '../constants/account'
import { TransactionStatus, TransactionType } from '../constants/transaction'
import { Transaction } from '../entities/transaction.entity'
import { User } from '../entities/user.entity'
import { AccountDepositDto, AccountTransferDto } from '../schemas/transaction.schema'
import { TransactionData } from '../types/transaction.interface'
import { AccountService } from './account.service'
import { BadRequestException } from '../utils/exceptions/badRequestException'
import { logger } from '../utils/logger'

export class TransactionService {
  private accountService: AccountService
  constructor() {
    this.accountService = new AccountService()
  }

  public deposit = async (depositUser: User, depositInfo: AccountDepositDto): Promise<Transaction> => {
    const transactionInfo: TransactionData = {
      accountNumber: depositInfo.accountNumber,
      bankCode: depositInfo.bankCode,
      branchCode: depositInfo.branchCode,
      currency: depositInfo.currency,
      amount: depositInfo.amount,
      transactionType: TransactionType.DEPOSIT,
    }

    console.log('transactionInfo', transactionInfo)

    return await this.transaction(depositUser, transactionInfo)
  }

  public withdraw = async (withdrawUser: User, withdrawInfo: AccountDepositDto): Promise<Transaction> => {
    const transactionInfo: TransactionData = {
      accountNumber: withdrawInfo.accountNumber,
      bankCode: withdrawInfo.bankCode,
      branchCode: withdrawInfo.branchCode,
      currency: withdrawInfo.currency,
      amount: withdrawInfo.amount,
      transactionType: TransactionType.WITHDRAW,
    }

    return await this.transaction(withdrawUser, transactionInfo)
  }

  private transaction = async (user: User, transactionInfo: TransactionData): Promise<Transaction> => {
    const { accountNumber, bankCode, branchCode, currency, amount, transactionType } = transactionInfo

    const userAccount = await this.accountService.getAccountWithAccountNumber(
      user,
      accountNumber,
      bankCode,
      branchCode,
      currency
    )

    logger.info('log: Transaction info', {
      accountNumber,
      bankCode,
      branchCode,
      currency,
      amount,
    })

    if (!userAccount) {
      throw new BadRequestException('Account not found')
    }

    if (userAccount.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is not active')
    }

    // Check for sufficient funds for withdrawal
    if (transactionType === TransactionType.WITHDRAW && userAccount.balance < amount) {
      throw new BadRequestException('Insufficient balance')
    }

    let savedTransaction: Transaction

    await entityManager.transaction(async (transactionalEntityManager) => {
      // Update user account balance
      const signedAmount = transactionType === TransactionType.WITHDRAW ? -amount : amount
      userAccount.balance = userAccount.balance + signedAmount
      await transactionalEntityManager.save(userAccount)

      // Create transaction history
      const transaction = new Transaction()
      transaction.transactionType = transactionType
      transaction.amount = signedAmount
      transaction.status = TransactionStatus.COMPLETED
      transaction.currency = currency
      transaction.receiver = userAccount
      transaction.sender = userAccount
      transaction.description = transactionType === TransactionType.DEPOSIT ? 'Deposit money' : 'Withdraw money'

      savedTransaction = await transactionalEntityManager.save(transaction)
    })

    return savedTransaction!
  }

  public transfer = async (senderUser: User, transferInfo: AccountTransferDto): Promise<Transaction> => {
    // Check sender account exists and belongs to user
    const transferSenderAccountId = transferInfo.senderAccountId
    const senderAccount = await this.accountService.getAccountWithAccountId(senderUser, transferSenderAccountId)
    if (!senderAccount) {
      throw new BadRequestException('Sender account not found')
    }

    // Check sender account status is active
    if (senderAccount.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Sender account is not active')
    }

    // Check sender has enough balance
    if (senderAccount.balance < transferInfo.amount) {
      throw new BadRequestException('Insufficient balance')
    }

    // Check receiver account exists
    const accountInfo = {
      accountNumber: transferInfo.receiverAccountNumber,
      bankCode: transferInfo.receiverBankCode,
      branchCode: transferInfo.receiverBranchCode,
      currency: transferInfo.currency,
    }
    const receiverAccount = await this.accountService.getAccountInfo(accountInfo)

    if (!receiverAccount) {
      throw new BadRequestException('Receiver account not found')
    }

    // Check receiver account status is active
    if (receiverAccount.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Receiver account is not active')
    }

    // Check currencies match
    if (receiverAccount.currency !== senderAccount.currency) {
      throw new BadRequestException('Currency mismatch between sender and receiver accounts')
    }

    let savedTransaction: Transaction

    // Execute transfer in transaction
    await entityManager.transaction(async (transactionalEntityManager) => {
      // Update sender account balance
      senderAccount.balance -= transferInfo.amount
      await transactionalEntityManager.save(senderAccount)

      // Update receiver account balance
      receiverAccount.balance += transferInfo.amount
      await transactionalEntityManager.save(receiverAccount)

      // Create transaction record
      const transaction = new Transaction()
      transaction.transactionType = TransactionType.TRANSFER
      transaction.amount = transferInfo.amount
      transaction.status = TransactionStatus.COMPLETED
      transaction.currency = transferInfo.currency
      transaction.receiver = receiverAccount
      transaction.sender = senderAccount
      transaction.description = `Transfer from ${senderAccount.accountNumber} to ${receiverAccount.accountNumber}`

      savedTransaction = await transactionalEntityManager.save(transaction)
    })

    return savedTransaction!
  }
}
