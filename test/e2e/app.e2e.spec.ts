import request from 'supertest'
import { app } from '../../src/app'
import { postgresDataSource } from '../../src/config/database'

describe('GET /', () => {
  beforeAll(async () => {
    await postgresDataSource.initialize()
  })

  afterAll(async () => {
    if (postgresDataSource.isConnected) {
      await postgresDataSource.destroy()
    }
  })

  it('should return Hello Worldaa', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
