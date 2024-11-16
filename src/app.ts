import 'reflect-metadata'
import express from 'express'
import { postgresDataSource } from './config/database'
import { logger } from './utils/logger'
import { authRouter } from './routes/auth.route'
import { errorHandler } from './middlewares/errorHandler'
import { initPassport } from './config/passport'
import passport from 'passport'
import { accountsRouter } from './routes/accounts.route'
import { baseRoutePaths } from './constants/routes'

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

app.use(passport.initialize())
initPassport()

app.use(baseRoutePaths.AUTH, authRouter)
app.use(baseRoutePaths.ACCOUNTS, accountsRouter)

app.get('/', (req, res) => {
  res.status(200)
  res.send()
})

app.use(errorHandler)

const port = process.env.PORT || 3000

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
