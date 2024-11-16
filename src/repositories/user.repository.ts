import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserRegistrationDto } from '../schemas/user.schema'

export class UserRepository {
  private repository: Repository<User>

  constructor(repository: Repository<User>) {
    this.repository = repository
  }

  public getUserByUsername = async (username: string): Promise<User> => {
    return this.repository.createQueryBuilder().where('username = :username', { username }).getOne()
  }

  public getUserByEmail = async (email: string): Promise<User> => {
    return this.repository.createQueryBuilder().where('email = :email', { email }).getOne()
  }

  public createUser = async (userData: UserRegistrationDto) => {
    const user = await User.insert(userData)

    return user.raw[0].id
  }
}
