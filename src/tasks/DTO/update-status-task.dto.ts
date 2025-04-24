import { TaskStatus } from '../task-status-enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusTaskDto {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
