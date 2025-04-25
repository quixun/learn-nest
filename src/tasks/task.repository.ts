import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './DTO/create-task.dto';
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }

  async findById(id: string, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id, user } });

    if (task === null) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteById(id: string, user: User): Promise<void> {
    await this.findById(id, user);
    await this.delete(id);
  }

  async findAllTasks(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filter;

    const querry = this.createQueryBuilder('task');

    querry.where({ user });

    if (status) {
      querry.andWhere('task.status = :status', { status });
    }

    if (search) {
      querry.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await querry.getMany();
  }

  async updateById(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.findById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    task.status = status;
    await this.save(task);
    return task;
  }

  async findAllTasksWithFilter(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    let tasks = await this.find();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }
}
