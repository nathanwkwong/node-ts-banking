import { Request } from 'express'
import crypto from 'crypto'
import { AuthenticationAudit } from '../entities/authenticationAudit.entity'
import { User } from '../entities/user.entity'
import { AuthenticationEventType, DeviceType } from '../constants/authenticationEvents'
import { logger } from '../utils/logger'

export interface AuthenticationAuditData {
  user?: User
  username: string
  eventType: AuthenticationEventType
  isSuccess: boolean
  failureReason?: string
  tokenHash?: string
  tokenExpiredAt?: Date
}

export class AuthenticationAuditService {
  private parseUserAgent(userAgent: string) {
    const ua = userAgent.toLowerCase()

    let deviceType = DeviceType.DESKTOP

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      deviceType = DeviceType.MOBILE
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = DeviceType.TABLET
    }

    let browserName = 'Unknown'
    let browserVersion = 'Unknown'

    if (ua.includes('chrome/') && !ua.includes('edg/')) {
      browserName = 'Chrome'
      const match = ua.match(/chrome\/([0-9.]+)/)
      browserVersion = match ? match[1] : 'Unknown'
    } else if (ua.includes('firefox/')) {
      browserName = 'Firefox'
      const match = ua.match(/firefox\/([0-9.]+)/)
      browserVersion = match ? match[1] : 'Unknown'
    } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
      browserName = 'Safari'
      const match = ua.match(/version\/([0-9.]+)/)
      browserVersion = match ? match[1] : 'Unknown'
    } else if (ua.includes('edg/')) {
      browserName = 'Edge'
      const match = ua.match(/edg\/([0-9.]+)/)
      browserVersion = match ? match[1] : 'Unknown'
    }

    return { deviceType, browserName, browserVersion }
  }

  private getClientIp(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for']
    const xRealIp = req.headers['x-real-ip']

    if (xForwardedFor) {
      const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor
      return ips.split(',')[0].trim()
    }

    if (xRealIp) {
      return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp
    }

    return req.connection.remoteAddress || req.socket.remoteAddress || 'Unknown'
  }

  private getForwardedIps(req: Request): string[] | undefined {
    const xForwardedFor = req.headers['x-forwarded-for']
    if (!xForwardedFor) return undefined

    const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor
    return ips.split(',').map((ip) => ip.trim())
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex').substring(0, 16)
  }

  async logAuthenticationEvent(req: Request, auditData: AuthenticationAuditData): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'] || 'Unknown'
      const { deviceType, browserName, browserVersion } = this.parseUserAgent(userAgent)

      const auditLog = new AuthenticationAudit()

      // User context
      auditLog.user = auditData.user
      auditLog.attemptedUsername = auditData.username

      // Event details
      auditLog.eventType = auditData.eventType
      auditLog.isSuccess = auditData.isSuccess
      auditLog.failureReason = auditData.failureReason
      auditLog.tokenHash = auditData.tokenHash ? this.hashToken(auditData.tokenHash) : undefined
      auditLog.sessionExpiredAt = auditData.tokenExpiredAt

      // Network info
      auditLog.ipAddress = this.getClientIp(req)
      auditLog.forwardedIps = this.getForwardedIps(req)
      auditLog.location = undefined // TODO: Add location lookup based on IP (optional for MVP)

      // Device info
      auditLog.userAgent = userAgent
      auditLog.deviceType = deviceType
      auditLog.browserName = browserName
      auditLog.browserVersion = browserVersion

      await auditLog.save()

      logger.info(`Authentication audit logged: ${auditData.eventType} for user ${auditData.username}`)
    } catch (error) {
      logger.error('Failed to log authentication audit:', error)
    }
  }
}

export const authenticationAuditService = new AuthenticationAuditService()
