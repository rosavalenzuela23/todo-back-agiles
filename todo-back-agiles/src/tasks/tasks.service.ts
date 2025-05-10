import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument, Status } from './schemas/task.schema';
import { TaskDTO, User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(User.name) private userDocument: Model<UserDocument>,
        private readonly userService: UsersService,
    ) { }

    async create(createTaskDto: CreateTaskDto, email: string): Promise<Task> {
        const task = new this.taskModel({ ...createTaskDto, userCreator: email });

        const savedTask = await task.save();

        // Agregar tarea al usuario
        await this.userModel.updateOne({ email }, {
            $push: { tasks: savedTask._id }
        });

        return savedTask;
    }

    async findAllByUser(email: string): Promise<TaskDTO[]> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`Usuario con el email ${email} no encontrado`);
        }

        return user.tasks;
    }

    async findAllByCategory(category: string, email: string): Promise<Task[]> {
        return this.taskModel.find({
            categoryName: category,
            userCreator: email
        })
            .sort({ endDate: 1 })
            .exec();
    }

    async update(
        taskId: string,
        updateTaskDto: UpdateTaskDto,
        email: string,
    ): Promise<Task> {
        const task = await this.taskModel.findOneAndUpdate(
            { _id: taskId, userCreator: email },
            updateTaskDto,
            { new: true }
        ).exec();

        if (!task) {
            throw new NotFoundException(`Tarea con id ${taskId} no encontrada`);
        }

        return task;
    }

    async remove(taskId: string, email: string): Promise<void> {
        const result = await this.taskModel.deleteOne({
            _id: taskId,
            userCreator: email
        }).exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Tarea con el id ${taskId} no encontrada`);
        }

        await this.userModel.updateOne({ email }, {
            $pull: { tasks: taskId }
        });
    }

    async changeStatus(
        taskId: string,
        status: Status,
        email: string,
    ): Promise<Task> {
        return this.update(taskId, { status }, email);
    }

    async changeBulk(userEmail: string, bulk: CreateTaskDto[]) {
        const user = await this.userService.findByEmail(userEmail);
        if (!user) {
            throw new NotFoundException(`Usuario con el email ${userEmail} no encontrado`);
        }

        var tasks: {
            title: string;
            description?: string;
            status?: Status;
            categoryName?: string;
            endDate?: Date;
        }[] = [];

        bulk.forEach(task => tasks.push({ ...task }));

        user.tasks = tasks as [];
        await this.userService.update(user.email, user);
    }

}
