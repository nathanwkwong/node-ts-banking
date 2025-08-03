import { BaseCronJob } from './baseCronJob'
import { CronJobInfo } from '../../types/cronJob.interface'
import { logger } from '../../utils/logger'

export class CronJobManager {
  private jobs: Map<string, BaseCronJob> = new Map()

  registerJob(job: BaseCronJob): void {
    const jobInfo = job.getInfo()
    if (this.jobs.has(jobInfo.name)) {
      throw new Error(`Job with name "${jobInfo.name}" is already registered`)
    }

    this.jobs.set(jobInfo.name, job)
    logger.info(`Registered cron job: ${jobInfo.name}`)
  }

  unregisterJob(jobName: string): void {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
      this.jobs.delete(jobName)
      logger.info(`Unregistered cron job: ${jobName}`)
    } else {
      logger.warn(`Job "${jobName}" not found for unregistering`)
    }
  }

  startJob(jobName: string): void {
    const job = this.jobs.get(jobName)
    if (job) {
      job.start()
    } else {
      throw new Error(`Job "${jobName}" not found`)
    }
  }

  stopJob(jobName: string): void {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
    } else {
      throw new Error(`Job "${jobName}" not found`)
    }
  }

  restartJob(jobName: string): void {
    const job = this.jobs.get(jobName)
    if (job) {
      job.restart()
    } else {
      throw new Error(`Job "${jobName}" not found`)
    }
  }

  async runJobNow(jobName: string): Promise<void> {
    const job = this.jobs.get(jobName)
    if (job) {
      await job.runNow()
    } else {
      throw new Error(`Job "${jobName}" not found`)
    }
  }

  startAllJobs(): void {
    for (const [name, job] of this.jobs) {
      try {
        job.start()
      } catch (error) {
        logger.error(`Failed to start job "${name}":`, error)
      }
    }
  }

  stopAllJobs(): void {
    for (const [name, job] of this.jobs) {
      try {
        job.stop()
      } catch (error) {
        logger.error(`Failed to stop job "${name}":`, error)
      }
    }
  }

  getJobInfo(jobName: string): CronJobInfo | null {
    const job = this.jobs.get(jobName)
    return job ? job.getInfo() : null
  }

  getAllJobsInfo(): CronJobInfo[] {
    return Array.from(this.jobs.values()).map((job) => job.getInfo())
  }

  getJob(jobName: string): BaseCronJob | undefined {
    return this.jobs.get(jobName)
  }

  hasJob(jobName: string): boolean {
    return this.jobs.has(jobName)
  }

  getJobNames(): string[] {
    return Array.from(this.jobs.keys())
  }

  logRegisteredJobs() {
    const jobs = this.getAllJobsInfo()
    logger.info(`Registered ${jobs.length} cron job(s):`)
    jobs.forEach((job) => {
      logger.info(`  - ${job.name}: ${job.schedule} (${job.enabled ? 'enabled' : 'disabled'})`)
    })
  }
}

export const cronJobManager = new CronJobManager()
