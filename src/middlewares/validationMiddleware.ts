import { NextFunction, Request, RequestHandler, Response } from 'express'
import { z, ZodTypeAny } from 'zod'

type Source = 'body' | 'params' | 'query'

const validateData = (schema: ZodTypeAny, source: Source) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[source])
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: z.ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(401).json({ error: 'Invalid data', details: errorMessages })
      } else {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  }
}

export const validateRequestBody = (schema: ZodTypeAny): RequestHandler => {
  return validateData(schema, 'body')
}

export const validateRequestParams = (schema: ZodTypeAny): RequestHandler => {
  return validateData(schema, 'params')
}

export const validateRequestQuery = (schema: ZodTypeAny): RequestHandler => {
  return validateData(schema, 'query')
}
