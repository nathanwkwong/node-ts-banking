import { errorHandler } from '../middlewares/errorHandler'
import { BadRequestException } from '../utils/exceptions/badRequestException'
import { logger } from '../utils/logger'
import express from 'express'

jest.mock('../utils/logger')

describe('errorHandler', () => {
  let req: express.Request
  let res: express.Response

  beforeEach(() => {
    req = {} as express.Request
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as express.Response
  })

  it('should log the error message', () => {
    const error = new Error('Test error')
    errorHandler(error, req, res)
    expect(logger.info).toHaveBeenCalledWith('Error log:', 'Test error')
  })

  it('should handle BadRequestException and return the correct status and message', () => {
    const error = new BadRequestException('Bad request')
    errorHandler(error, req, res)
    expect(res.status).toHaveBeenCalledWith(error.status)
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad request' })
  })

  it('should handle generic errors and return 500 status', () => {
    const error = new Error('Generic error')
    errorHandler(error, req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
