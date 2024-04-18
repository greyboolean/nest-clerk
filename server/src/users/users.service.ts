import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // createUserDto.password = await this.hashPassword(createUserDto.password);
    const createdUser = await this.prisma.user.create({ data: createUserDto });
    return createdUser;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // if (updateUserDto.password) {
    //   updateUserDto.password = await this.hashPassword(updateUserDto.password);
    // }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number) {
    const removedUser = await this.prisma.user.delete({ where: { id } });
    if (!removedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return removedUser;
  }

  // async hashPassword(password: string) {
  //   const salt = await bcrypt.genSaltSync();
  //   return bcrypt.hash(password, salt);
  // }
}
