import { z } from 'zod'
import { AccountStatus, AccountType } from '../constants/account'
import { AccountCurrency } from '../constants/currency'

export const AccountCreationSchema = z.object({
  username: z.string(),
  accountType: z.nativeEnum(AccountType),
  currency: z.nativeEnum(AccountCurrency),
  status: z.nativeEnum(AccountStatus),
  bankCode: z.string(),
  branchCode: z.string(),
})

export const ModifyAccountStatusSchema = z.object({
  status: z.nativeEnum(AccountStatus),
  description: z.string().optional(),
})

export type ModifyAccountStatusDto = z.infer<typeof ModifyAccountStatusSchema>
export type CreateAccountInfoDto = z.infer<typeof AccountCreationSchema>

export type AccountInfoDto = z.infer<typeof AccountCreationSchema> & {
  accountNumber: string
}

export const GetAccountWithAccountIdSchema = z.object({
  accountId: z.string().uuid(),
})
export type GetAccountParam = z.infer<typeof GetAccountWithAccountIdSchema>
