import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './DTO/create-task.dto';
import { TaskRepository } from './task.repository';
import { isUUID } from 'class-validator';
import { TaskStatus } from './task-status-enum';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(filter: GetTasksFilterDto, user: User) {
    return this.taskRepository.findAllTasks(filter, user);
  }

  //

  async getTaskById(id: string, user: User): Promise<Task> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid UUID format: "${id}"`);
    }
    return await this.taskRepository.findById(id, user);
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto) {
    return this.taskRepository.findAllTasksWithFilter(filterDto);
  }

  //
  async updateStatusTaskById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    return await this.taskRepository.updateById(id, status, user);
  }

  //
  deleteTaskById(id: string, user: User): Promise<void> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid UUID format: "${id}"`);
    }
    return this.taskRepository.deleteById(id, user);
  }

  //
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
}
