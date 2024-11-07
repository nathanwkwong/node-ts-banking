import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // write logs with level 'error' to `error.log` file
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    // write logs with level 'info' or higher to `combined.log` file
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
})

// log the console for non-production
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}
