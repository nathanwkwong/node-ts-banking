import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Account } from './account.entity'
import { AccountCurrency } from '../constants/currency'
import { TransactionStatus, TransactionType } from '../constants/transaction'

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => Account)
  @JoinColumn({ name: 'receiverAccountId' })
  receiver: Account

  @OneToOne(() => Account)
  @JoinColumn({ name: 'senderAccountId' })
  sender: Account

  @Column('enum', { enum: AccountCurrency, nullable: false })
  currency: AccountCurrency

  @Column('enum', { enum: TransactionType, nullable: false })
  // e.g. bank, peer-to-peer, refund...
  transactionType: TransactionType

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column()
  description: string

  @Column('enum', { enum: TransactionStatus, nullable: false })
  status: string

  @CreateDateColumn()
  createdAt: Date
}
