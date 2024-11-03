import 'reflect-metadata'
import express from 'express'
import { postgresDataSource } from './config/database'
import { logger } from './utils/logger'
import * as client from 'prom-client'

postgresDataSource
  .initialize()
  .then(async () => {
    logger.info('Database initialized')
  })
  .catch((err) => {
    logger.info('Error connecting to initialized: ', err)
  })

export const app = express()
app.use(express.json())

// Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics
const register = new client.Registry()

collectDefaultMetrics({ register })

// api for prometheus to scrape
app.use('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(register.metrics())
})

app.get('/', (req, res) => {
  console.log('HERE IS: ')
  res.status(200)
  res.send()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
