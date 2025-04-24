import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './DTO/create-task.dto';
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    return await this.findOneBy({ id });
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(id);
  }

  async findAllTasks(): Promise<Task[]> {
    return await this.find();
  }

  async updateById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findById(id);
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
