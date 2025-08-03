export interface CronJobConfig {
  name: string
  schedule: string
  enabled: boolean
  timezone?: string
  description?: string
}

export interface CronJobExecutor {
  execute(): Promise<void>
}

export interface CronJobInfo {
  name: string
  schedule: string
  isRunning: boolean
  nextRun?: Date
  lastRun?: Date
  enabled: boolean
  description?: string
}
