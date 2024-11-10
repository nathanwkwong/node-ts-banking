import { z } from 'zod'

export const UserRegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
})
export type UserRegistrationDto = z.infer<typeof UserRegistrationSchema>

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})
export type UserLoginDto = z.infer<typeof UserLoginSchema>
