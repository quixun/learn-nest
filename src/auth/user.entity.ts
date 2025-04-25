import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[] | undefined;
}
