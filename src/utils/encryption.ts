import * as bcrypt from 'bcrypt'
import 'dotenv/config'

export async function hashPassword(plainPassword: string) {
  const hash = await bcrypt.hash(plainPassword, Number(process.env.BCRYPT_SALT_ROUNDS))
  return hash
}

export async function checkPassword(plainPassword: string, hashPassword: string) {
  const isMatch = await bcrypt.compare(plainPassword, hashPassword)
  return isMatch
}
