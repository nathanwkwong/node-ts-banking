import { z } from 'zod'

export const UserRegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})
export type UserRegistrationDto = z.infer<typeof UserRegistrationSchema>

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})
export type UserLoginDto = z.infer<typeof UserLoginSchema>
