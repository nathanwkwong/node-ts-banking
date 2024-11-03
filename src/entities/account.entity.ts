import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'
import { AccountCurrency } from '../constants/currency'
import { AccountStatus, AccountType } from '../constants/account'

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  user: User

  @Column({ unique: true })
  @Generated('increment')
  accountNumber: number

  @Column('enum', { enum: AccountCurrency, default: AccountCurrency.HKD })
  currency: AccountCurrency

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number

  @Column('enum', { enum: AccountType, default: AccountType.SAVING })
  accountType: AccountType

  @Column('enum', { enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
