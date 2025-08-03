import { cronJobManager } from '../services/cronJob/cronJob.service'
import { AuditCleanupCronJob, AuditCleanupJobConfig } from '../services/authenticationAudit/authAuditCleanupCronJob'
import { logger } from './logger'

enum CronJobName {
  AUDIT_CLEANUP = 'audit-cleanup',
}

export const initCronJobs = () => {
  const enableCronJobs = process.env.ENABLE_CRON_JOBS === 'true'

  if (enableCronJobs) {
    try {
      const cronJobConfig: AuditCleanupJobConfig = {
        name: CronJobName.AUDIT_CLEANUP,
        schedule: process.env.AUDIT_CLEANUP_CRON || '0 2 * * *', // Default: Daily at 2 AM
        enabled: process.env.AUDIT_CLEANUP_ENABLED !== 'false',
        timezone: process.env.CRON_TIMEZONE || 'UTC',
        description: 'Cleans up expired authentication audit records',
        batchSize: parseInt(process.env.AUDIT_CLEANUP_BATCH_SIZE || '1000'),
      }
      const auditCleanupJob = new AuditCleanupCronJob(cronJobConfig)
      cronJobManager.registerJob(auditCleanupJob)

      cronJobManager.startAllJobs()
      logger.info('Cron jobs initialized successfully')

      cronJobManager.logRegisteredJobs()
    } catch (error) {
      logger.error('Failed to initialize cron jobs:', error)
    }
  } else {
    logger.info('Cron jobs disabled (set ENABLE_CRON_JOBS=true to enable)')
  }
}
