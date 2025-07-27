import { Request, Response, NextFunction } from 'express'

export class NotFoundException extends Error {
  public status: number

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundException'
    this.status = 404
  }
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundException(`Route ${req.path} not found.`)
  next(err)
}
