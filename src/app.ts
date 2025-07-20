import 'reflect-metadata'
import express from 'express'
import { postgresDataSource } from './config/database'
import { logger } from './utils/logger'
import { authRouter } from './routes/auth.route'
import { errorHandler } from './middlewares/errorHandler'
import { initPassport } from './config/passport'
import passport from 'passport'
import { accountsRouter } from './routes/accounts.route'
import { routes } from './constants/routes'
import { transactionsRouter } from './routes/transactions.route'

const initDatabase = async () => {
  try {
    await postgresDataSource.initialize()
    logger.info('Database initialized')
  } catch (err) {
    /* istanbul ignore next */
    logger.info('Error connecting to initialized: ', err)
  }
}

initDatabase()

export const app = express()

app.use(express.json())

app.use(passport.initialize())
initPassport()

app.use(routes.auth._full, authRouter)
app.use(routes.account._full, accountsRouter)
app.use(routes.transaction._full, transactionsRouter)

app.get('/', (req, res) => {
  res.status(200)
  res.send()
})

app.use(errorHandler)

const port = process.env.PORT || 3000

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
  })
}
