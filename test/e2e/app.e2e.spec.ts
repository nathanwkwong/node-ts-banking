import request from 'supertest'
import { app } from '../../src/app'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { Client } from 'pg'

describe('GET /', () => {
  let postgresContainer
  let postgresClient

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start()
    postgresClient = new Client({ connectionString: postgresContainer.getConnectionUri() })
    await postgresClient.connect()
  })

  afterAll(async () => {
    await postgresClient.end()
    await postgresContainer.stop()
  })

  it('should return Hello Worldaa', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
