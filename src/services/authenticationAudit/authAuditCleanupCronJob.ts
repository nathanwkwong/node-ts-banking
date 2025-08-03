import { BaseCronJob } from '../cronJob/baseCronJob'
import { CronJobConfig } from '../../types/cronJob.interface'
import { logger } from '../../utils/logger'
import { Repository } from 'typeorm'
import { AuthenticationAudit } from '../../entities/authenticationAudit.entity'
import { postgresDataSource } from '../../config/database'

export interface AuditCleanupJobConfig extends CronJobConfig {
  batchSize?: number
}

export class AuditCleanupCronJob extends BaseCronJob {
  private batchSize: number
  private authAuditRepository: Repository<AuthenticationAudit>

  constructor(config: AuditCleanupJobConfig) {
    super(config)
    this.batchSize = config.batchSize
    this.authAuditRepository = postgresDataSource.getRepository(AuthenticationAudit)
  }

  async execute(): Promise<void> {
    try {
      await this.getAuditStatistics()
      await this.cleanupAuthenticationAudits(this.batchSize)
      await this.getAuditStatistics()
    } catch (error) {
      logger.error('Audit cleanup execution failed:', error)
      throw error
    }
  }

  async cleanupAuthenticationAudits(batchSize: number = 1000): Promise<number> {
    try {
      logger.info('Starting authentication audit cleanup job')

      let totalDeleted = 0
      let hasMoreRecords = true

      while (hasMoreRecords) {
        // Calculate cutoff date for each record based on createdAt + retentionDays
        const expiredAudits = await this.authAuditRepository
          .createQueryBuilder('audit')
          .where("audit.createdAt + INTERVAL '1 day' * audit.retentionDays < :now", {
            now: new Date(),
          })
          .limit(batchSize)
          .getMany()

        if (expiredAudits.length === 0) {
          hasMoreRecords = false
          break
        }

        const expiredIds = expiredAudits.map((audit) => audit.id)
        const deleteResult = await this.authAuditRepository.delete(expiredIds)

        const deletedCount = deleteResult.affected || 0
        totalDeleted += deletedCount

        logger.info(`Deleted ${deletedCount} expired authentication audit records`)

        if (deletedCount < batchSize) {
          hasMoreRecords = false
        }
      }

      logger.info(`Authentication audit cleanup completed. Total records deleted: ${totalDeleted}`)
      return
    } catch (error) {
      logger.error('Error during authentication audit cleanup:', error)
      throw error
    }
  }

  async getAuditStatistics(): Promise<{
    totalRecords: number
    expiredRecords: number
    oldestRecord: Date | null
    newestRecord: Date | null
  }> {
    try {
      const totalRecords = await this.authAuditRepository.count()

      const expiredRecords = await this.authAuditRepository
        .createQueryBuilder('audit')
        .where("audit.createdAt + INTERVAL '1 day' * audit.retentionDays < :now", {
          now: new Date(),
        })
        .getCount()

      const oldestRecord = await this.authAuditRepository
        .createQueryBuilder('audit')
        .select('MIN(audit.createdAt)', 'oldest')
        .getRawOne()

      const newestRecord = await this.authAuditRepository
        .createQueryBuilder('audit')
        .select('MAX(audit.createdAt)', 'newest')
        .getRawOne()

      const stats = {
        totalRecords,
        expiredRecords,
        oldestRecord: oldestRecord?.oldest || null,
        newestRecord: newestRecord?.newest || null,
      }

      logger.info('Audit statistics after cleanup:', stats)

      return stats
    } catch (error) {
      logger.error('Error getting audit statistics:', error)
      throw error
    }
  }
}
