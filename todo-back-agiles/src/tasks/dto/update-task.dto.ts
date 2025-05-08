import { IsString, IsOptional, IsEnum, IsDateString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../schemas/task.schema';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

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