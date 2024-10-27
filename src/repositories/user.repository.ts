import { postgresDataSource } from '../config/database'
import { User } from '../entities/user.entity'
import { InferredUserReg } from '../schemas/user.schema'

export class UserRepository {
  async createUser(userData: InferredUserReg) {
    // TODO: check if username, email exist
    const user = await postgresDataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ username: userData.username, email: userData.email, password: userData.password }])
      .execute()

    return user
  }
}
