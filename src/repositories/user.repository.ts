import { postgresDataSource } from '../config/database'
import { User } from '../entities/user.entity'
import { UserRegistrationDto } from '../schemas/user.schema'

export class UserRepository {
  getUserByUsername = async (username: string): Promise<User> => {
    const user = await postgresDataSource
      .getRepository(User)
      .createQueryBuilder()
      .where('username = :username', { username })
      .getOne()

    return user
  }

  getUserByEmail = async (email: string): Promise<User> => {
    const user = await postgresDataSource
      .getRepository(User)
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne()

    return user
  }

  createUser = async (userData: UserRegistrationDto) => {
    const user = await postgresDataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ username: userData.username, email: userData.email, password: userData.password }])
      .execute()
    return user
  }
}
