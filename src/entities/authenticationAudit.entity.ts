import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { YEARS_IN_DAYS } from '../constants/system'

@Entity()
export class AuthenticationAudit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // User Context
  @ManyToOne(() => User, { nullable: true })
  user?: User
  @Column()
  eventType: string

  // Event Details
  @Column({ nullable: true })
  attemptedUsername?: string
  @Column()
  isSuccess: boolean
  @Column({ nullable: true })
  failureReason?: string
  @Column({ nullable: true })
  sessionExpiredAt?: Date
  @Column({ nullable: true })
  tokenHash?: string

  // Network info
  @Column()
  ipAddress: string
  @Column('simple-array', { nullable: true })
  forwardedIps?: string[]

  // Device information
  @Column()
  userAgent: string
  @Column({ nullable: true })
  location?: string
  @Column()
  deviceType: string
  @Column()
  browserName: string
  @Column()
  browserVersion: string

  // Event Metadata
  @CreateDateColumn()
  createdAt: Date
  @Column({ default: 7 * YEARS_IN_DAYS })
  retentionDays: number
}
