import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status-enum';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status!: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User | undefined;
}
