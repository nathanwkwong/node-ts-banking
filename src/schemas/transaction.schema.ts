import { z } from 'zod'
import { AccountCurrency } from '../constants/currency'

export const AccountDepositSchema = z.object({
  amount: z.number(),
  accountNumber: z.string(),
  bankCode: z.string(),
  branchCode: z.string(),
  currency: z.nativeEnum(AccountCurrency),
})

export const AccountTransferSchema = z.object({
  amount: z.number(),
  receiverAccountNumber: z.string(),
  receiverBankCode: z.string(),
  receiverBranchCode: z.string(),
  currency: z.nativeEnum(AccountCurrency),
  senderAccountId: z.string().uuid(),
})

export type AccountDepositDto = z.infer<typeof AccountDepositSchema>
export type AccountTransferDto = z.infer<typeof AccountTransferSchema>
