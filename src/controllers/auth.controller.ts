// functions to get the requestsed data from the models
import express, { NextFunction } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
  private authService: AuthService
  constructor(authService: AuthService) {
    this.authService = authService
  }

  createUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const userData = req.body
      const user = await this.authService.createUser(userData)
      res.status(201).send(user)
    } catch (error) {
      next(error)
    }
  }
}
