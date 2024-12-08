import { z } from 'zod'
import { AccountCurrency } from '../constants/currency'

export const AccountDepositSchema = z.object({
  amount: z.number(),
  receiverAccountNumber: z.string(),
  receiverBankCode: z.string(),
  receiverBranchCode: z.string(),
  currency: z.nativeEnum(AccountCurrency),
  senderAccountId: z.string().uuid(),
})

export type AccountDepositDto = z.infer<typeof AccountDepositSchema>
