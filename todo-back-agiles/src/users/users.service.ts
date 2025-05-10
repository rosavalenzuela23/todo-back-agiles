import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    /**
     * Metodo para crear un usuario.
     * @param createUserDto Parametros con validaciones para crear un usuario.
     * @returns Usuario creado.
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, username } = createUserDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('El email ya esta registrado');
        }

        const user = new this.userModel({
            email,
            password: password,
            username,
        });

        return await user.save();
    }

    /**
     * Metodo para buscar a todos los usuarios sin mostrar la contraseña.
     * @returns Lista de usuarios ocultando la contraseña.
     */
    async findAll(): Promise<User[]> {
        return await this.userModel.find().select('-password').exec();
    }

    /**
     * Metodo para buscar un usuario por su nombre.
     * @param username Nombre de usuario a buscar.
     * @returns Usario encontrado por su nombre o 'null' si no existe.
     */
    async findByName(username: string): Promise<User | null> {
        return await this.userModel.findOne({ username }).exec();
    }

    /**
     * Metodo para buscar un usuario por su email.
     * @param email Email del usuario a buscar.
     * @returns Usuario encontrado por su email o 'undefined' si no existe.
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    /**
     * Metodo para actualizar un usuario por su id.
     * @param id Id del usuario a actualizar.
     * @param updateUserDto Validaciones para actualizar un usuario.
     * @returns Actualizacion del usuario con contraseña hasheada.
     */
    async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
        const updateData: any = { ...updateUserDto };

        //Hash de la contraseña si se actualiza.
        if (updateUserDto.password) {
            updateUserDto.password = updateUserDto.password
        }

        const updatedUser = await this.userModel.findOneAndUpdate(
            { email: email }, updateData, { new: true }
        );
        
        console.log(updatedUser?.toJSON());
        if (!updatedUser) throw new NotFoundException(`Usuario con el id ${email} no encontrado`);
        return updatedUser;
    }

    /**
     * Metodo para eliminar un usuario por su id.
     * @param id Id del usuario a eliminar
     */
    async remove(email: string): Promise<void> {
        await this.userModel.findOneAndDelete({ email }).exec();
        if (!email) throw new NotFoundException(`Usuario con el id ${email} no encontrado`);
    }

    async getUserWithTasks(email: string): Promise<User | null> {
        return this.userModel.findOne({ email })
            .exec();
    }

    /**
     * Validar la contraseña del usuario.
     * @param user Usuario a validar.
     * @param password Contraseña a validar.
     * @returns Validacion de la contraseña del usuario.
     */
    async validatePassword(user: UserDocument, password: string): Promise<boolean> {
        return compareSync(password, user.password);
    }
}
