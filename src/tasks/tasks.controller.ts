import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { UpdateStatusTaskDto } from './DTO/update-status-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() filter: GetTasksFilterDto, @GetUser() user: User) {
    return this.tasksService.getTasks(filter, user);
  }

  //
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  //
  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.deleteTaskById(id, user);
  }

  //
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Patch('/:id')
  updateTaskById(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: UpdateStatusTaskDto,
    @GetUser() user: User,
  ) {
    const { status } = updateStatusTaskDto;
    return this.tasksService.updateStatusTaskById(id, status, user);
  }
}
