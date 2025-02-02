import { AccountCurrency } from '../constants/currency'
import { TransactionType } from '../constants/transaction'

export interface TransactionData {
  amount: number
  transactionType: TransactionType
  accountNumber: string
  bankCode: string
  branchCode: string
  currency: AccountCurrency
}
