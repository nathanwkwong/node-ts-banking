import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  // make this column required
  @Column({ nullable: false })
  bankCode: string

  @Column({ nullable: false })
  branchCode: string

  @Column({ unique: true, nullable: false })
  accountNumber: string

  @Column('enum', { enum: AccountCurrency, default: AccountCurrency.HKD, nullable: false })
  currency: AccountCurrency

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number

  @Column('enum', { enum: AccountType, default: AccountType.SAVING, nullable: false })
  accountType: AccountType

  @Column('enum', { enum: AccountStatus, default: AccountStatus.ACTIVE, nullable: false })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
