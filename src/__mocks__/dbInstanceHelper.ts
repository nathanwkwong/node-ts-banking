import { DataSource, EntityTarget } from 'typeorm'
import 'dotenv/config'

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env
// const pgContainer = await new PostgreSqlContainer().start()

export class TestHelper {
  private static _instance: TestHelper

  private constructor() {}

  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper()

    return this._instance
  }

  private dbConnect!: DataSource

  getRepo<T>(entity: EntityTarget<T>) {
    return this.dbConnect.getRepository<T>(entity)
  }

  async setupTestDB() {
    this.dbConnect = new DataSource({
      name: 'unit-tests',
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT),
      username: DB_USER,
      password: DB_PASS,
      database: 'test_' + DB_NAME,
      entities: ['src/entities/**/*.ts'],
      synchronize: true,
      // dropSchema: true,
    })

    await this.dbConnect.initialize()
  }

  teardownTestDB() {
    if (this.dbConnect.isInitialized) this.dbConnect.destroy()
  }
}
