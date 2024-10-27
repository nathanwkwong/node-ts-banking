import express from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
  private service: AuthService
  constructor(authService: AuthService) {
    this.service = authService
  }

  createUser = async (req: express.Request, res: express.Response) => {
    try {
      const userData = req.body
      const user = this.service.createUser(userData)
      res.status(201).send(user)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
