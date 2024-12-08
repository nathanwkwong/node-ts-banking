import { User } from '../entities/user.entity'
import { AccountDepositDto } from '../schemas/transaction.schema'

export class TransactionService {
  constructor() {}

  public deposit = async (senderUser: User, depositInfo: AccountDepositDto) => {
    try {
      // check sender account is under senderUser exist
      // check sender account status as active
      // check sender have enough amount
      // check receiver account is exist (mapping with bank code, branch code, account number)
      // check receiver account status as active
      // check receiver account currency is same as sender account currency
      // send money to receiver (update sender account balance, update receiver account balance)
    } catch (error) {}
  }
}
