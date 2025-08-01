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

export const AccountWithdrawSchema = z.object({
  amount: z.number(),
  accountNumber: z.string(),
  bankCode: z.string(),
  branchCode: z.string(),
  currency: z.nativeEnum(AccountCurrency),
})

export const AccountHistorySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  bankCode: z.string(),
  branchCode: z.string(),
  currency: z.nativeEnum(AccountCurrency),
})

export const AccountIdSchema = z.object({
  accountId: z.string().uuid(),
})

export type AccountDepositDto = z.infer<typeof AccountDepositSchema>
export type AccountTransferDto = z.infer<typeof AccountTransferSchema>
export type AccountWithdrawDto = z.infer<typeof AccountWithdrawSchema>
export type AccountHistoryDto = z.infer<typeof AccountHistorySchema>
export type AccountIdDto = z.infer<typeof AccountIdSchema>
