import express, { NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { UserLoginDto } from '../schemas/user.schema'

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

  login = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const { username, password } = req.body as UserLoginDto
      const loginData = await this.authService.login(username, password)
      res.status(200).send(loginData)
    } catch (error) {
      next(error)
    }
  }
}