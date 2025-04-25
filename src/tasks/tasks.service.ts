import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './DTO/create-task.dto';
import { TaskRepository } from './task.repository';
import { isUUID } from 'class-validator';
import { TaskStatus } from './task-status-enum';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getAllTasks() {
    return this.taskRepository.findAllTasks();
  }

  //

  async getTaskById(id: string): Promise<Task> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid UUID format: "${id}"`);
    }
    const task = await this.taskRepository.findById(id);
    if (task === null) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto) {
    return this.taskRepository.findAllTasksWithFilter(filterDto);
  }

  //
  async updateStatusTaskById(id: string, status: TaskStatus): Promise<Task> {
    return await this.taskRepository.updateById(id, status);
  }

  //
  deleteTaskById(id: string): Promise<void> {
    return this.taskRepository.deleteById(id);
  }

  //
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
}
