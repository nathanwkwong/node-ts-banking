import 'reflect-metadata'
import express from 'express'
import { postgresDataSource } from './config/database'

postgresDataSource
  .initialize()
  .then(async () => {
    console.log('Database initialized')
  })
  .catch((err) => {
    console.log('Error connecting to initialized: ', err)
  })

export const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200)
  res.send()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
