import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Account } from './account.entity'
import { AccountCurrency } from '../constants/currency'
import { TransactionStatus, TransactionType } from '../constants/transaction'
import { DecimalTransformer } from '../utils/transformers/decimal.transformer'

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'receiverAccountId' })
  receiver: Account

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'senderAccountId' })
  sender: Account

  @Column('enum', { enum: AccountCurrency, nullable: false })
  currency: AccountCurrency

  @Column('enum', { enum: TransactionType, nullable: false })
  // e.g. bank, peer-to-peer, refund...
  transactionType: TransactionType

  @Column('decimal', { precision: 10, scale: 2, transformer: new DecimalTransformer() })
  amount: number

  @Column({ type: 'text', nullable: true })
  description: string

  @Column('enum', { enum: TransactionStatus, nullable: false })
  status: string

  @CreateDateColumn()
  createdAt: Date
}
