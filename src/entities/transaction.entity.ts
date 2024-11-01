import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Account } from './account.entity'

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Account)
  account: Account

  @Column()
  transactionType: string

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column()
  description: string

  @Column()
  status: string

  @CreateDateColumn()
  createdAt: Date
}
