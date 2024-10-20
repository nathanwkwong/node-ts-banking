import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  user: User

  @Column()
  action: string

  @Column('jsonb')
  details: object

  @Column()
  ipAddress: string

  @CreateDateColumn()
  createdAt: Date
}
