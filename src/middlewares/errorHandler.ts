import express from 'express'
import { BadRequestException } from '../utils/exceptions/badRequestException'
import { logger } from '../utils/logger'
import { NotFoundException } from './notFoundHandler'

export const errorHandler = (err: Error, req: express.Request, res: express.Response) => {
  logger.info('Error log:', err.message)

  if (err instanceof NotFoundException) {
    res.status(err.status).json({ error: err.message })
  }

  if (err instanceof BadRequestException) {
    res.status(err.status).json({ error: err.message })
  }

  res.status(500).json({ error: 'Internal Server Error' })
}
