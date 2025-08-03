import * as cron from 'node-cron'
import { logger } from '../../utils/logger'
import { CronJobConfig, CronJobExecutor, CronJobInfo } from '../../types/cronJob.interface'

export abstract class BaseCronJob implements CronJobExecutor {
  protected task: cron.ScheduledTask | null = null
  protected config: CronJobConfig
  protected lastRun: Date | null = null

  constructor(config: CronJobConfig) {
    this.config = config
    this.validateConfig()
  }

  private validateConfig(): void {
    if (!cron.validate(this.config.schedule)) {
      throw new Error(`Invalid cron expression for job "${this.config.name}": ${this.config.schedule}`)
    }
  }

  abstract execute(): Promise<void>

  start(): void {
    if (this.task) {
      logger.warn(`Cron job "${this.config.name}" is already running`)
      return
    }

    if (!this.config.enabled) {
      logger.info(`Cron job "${this.config.name}" is disabled`)
      return
    }

    this.task = cron.schedule(
      this.config.schedule,
      async () => {
        try {
          logger.info(`Starting cron job: ${this.config.name}`)
          this.lastRun = new Date()
          await this.execute()
          logger.info(`Completed cron job: ${this.config.name}`)
        } catch (error) {
          logger.error(`Cron job "${this.config.name}" failed:`, error)
        }
      },
      {
        timezone: this.config.timezone || process.env.CRON_TIMEZONE || 'UTC',
      }
    )

    this.task.start()
    logger.info(`Cron job "${this.config.name}" started with schedule: ${this.config.schedule}`)
  }

  stop(): void {
    if (this.task) {
      this.task.stop()
      this.task = null
      logger.info(`Cron job "${this.config.name}" stopped`)
    } else {
      logger.warn(`No cron job "${this.config.name}" is currently running`)
    }
  }

  restart(): void {
    this.stop()
    this.start()
  }

  getInfo(): CronJobInfo {
    return {
      name: this.config.name,
      schedule: this.config.schedule,
      isRunning: this.task ? this.task.getStatus() === 'scheduled' : false,
      lastRun: this.lastRun,
      enabled: this.config.enabled,
      description: this.config.description,
    }
  }

  async runNow(): Promise<void> {
    try {
      logger.info(`Running cron job "${this.config.name}" manually`)
      this.lastRun = new Date()
      await this.execute()
      logger.info(`Manual execution of cron job "${this.config.name}" completed`)
    } catch (error) {
      logger.error(`Manual execution of cron job "${this.config.name}" failed:`, error)
      throw error
    }
  }
}
