import { z } from 'zod'
import { AccountStatus, AccountType } from '../constants/account'
import { AccountCurrency } from '../constants/currency'

export const AccountCreationSchema = z.object({
  username: z.string(),
  accountType: z.nativeEnum(AccountType),
  currency: z.nativeEnum(AccountCurrency),
  status: z.nativeEnum(AccountStatus),
})
export type AccountCreationDto = z.infer<typeof AccountCreationSchema>

export const GetAccountWithAccountIdSchema = z.object({
  accountId: z.string().uuid(),
})
export type GetAccountParam = z.infer<typeof GetAccountWithAccountIdSchema>