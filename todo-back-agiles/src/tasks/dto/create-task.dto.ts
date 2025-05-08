import { IsString, IsOptional, IsDateString, IsEnum } from '@nestjs/class-validator';
import { Status } from '../schemas/task.schema';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;

    @IsString()
    @IsOptional()
    categoryName?: string;

    @IsDateString()
    @IsOptional()
    endDate?: Date;
}