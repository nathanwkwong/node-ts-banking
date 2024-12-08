import request from 'supertest'
import express from 'express'
import { z, ZodTypeAny } from 'zod'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from './validationMiddleware'

const app = express()
app.use(express.json())

describe('validateData middleware', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number().int(),
  })

  app.post('/test-body', validateRequestBody(schema), (req, res) => {
    res.status(200).send('Valid data')
  })

  const paramSchema = z.object({
    name: z.string(),
    age: z.string(),
  })

  app.get('/test-params/:name/:age', validateRequestParams(paramSchema), (req, res) => {
    res.status(200).send('Valid data')
  })

  app.get('/test-query', validateRequestQuery(paramSchema), (req, res) => {
    res.status(200).send('Valid data')
  })

  it('should validate request body and pass', async () => {
    const response = await request(app).post('/test-body').send({ name: 'John', age: 30 })
    expect(response.status).toBe(200)
    expect(response.text).toBe('Valid data')
  })

  it('should validate request body and fail', async () => {
    const response = await request(app).post('/test-body').send({ name: 'John', age: 'thirty' })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'Invalid data')
  })

  it('should validate request params and pass', async () => {
    const response = await request(app).get('/test-params/John/thirty')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Valid data')
  })

  it('should validate request query and pass', async () => {
    const response = await request(app).get('/test-query').query({ name: 'John', age: 30 })
    expect(response.status).toBe(200)
    expect(response.text).toBe('Valid data')
  })

  it('should handle unexpected errors and return 500 status', async () => {
    const invalidSchema: ZodTypeAny = z.object({
      name: z.string(),
      age: z.number().int(),
    })
    jest.spyOn(invalidSchema, 'parse').mockImplementation(() => {
      throw new Error('Some error')
    })

    app.post('/test-unexpected-error', validateRequestBody(invalidSchema), (req, res) => {
      res.status(200).send('Valid data')
    })

    const response = await request(app).post('/test-unexpected-error').send({ name: 'John', age: 30 })
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('error', 'Internal Server Error')
  })
})
