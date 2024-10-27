import 'reflect-metadata'
import express from 'express'
import { postgresDataSource } from './config/database'
import { logger } from './utils/logger'
import { authRouter } from './routes/auth.route'

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

app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.status(200)
  res.send()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
