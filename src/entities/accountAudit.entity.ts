import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Account } from './account.entity'
import { User } from './user.entity'
import { AccountStatus } from '../constants/account'

@Entity()
export class AccountAudit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Account)
  account: Account

  @Column({
    type: 'enum',
    enum: AccountStatus,
    nullable: false,
  })
  fromStatus: string

  @Column({
    type: 'enum',
    enum: AccountStatus,
    nullable: false,
  })
  toStatus: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @ManyToOne(() => User, { nullable: true })
  changedBy?: User

  @CreateDateColumn()
  createdAt: Date
}
