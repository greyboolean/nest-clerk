import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { UpdateLocalUserDto } from './dto/update-local-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalUsersService {
  constructor(private prisma: PrismaService) {}

  async create(createLocalUserDto: CreateLocalUserDto) {
    // createLocalUserDto.password = await this.hashPassword(createLocalUserDto.password);
    const createdLocalUser = await this.prisma.user.create({
      data: createLocalUserDto,
    });
    console.log('created directly local');
    return createdLocalUser;
  }

  async findAll() {
    const localUsers = await this.prisma.user.findMany();
    return localUsers;
  }

  async findOne(id: number) {
    const localUser = await this.prisma.user.findUnique({ where: { id } });
    if (!localUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return localUser;
  }

  async findOneByClerkId(clerkId: string) {
    const localUser = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!localUser) {
      throw new NotFoundException(`User with clerkId ${clerkId} not found`);
    }
    return localUser;
  }

  // -- this method is not called. no updaes in local database so far
  async update(id: number, updateLocalUserDto: UpdateLocalUserDto) {
    // if (updateLocalUserDto.password) {
    //   updateLocalUserDto.password = await this.hashPassword(updateLocalUserDto.password);
    // }
    const updatedLocalUser = await this.prisma.user.update({
      where: { id },
      data: updateLocalUserDto,
    });
    if (!updatedLocalUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    console.log('updated directly local');
    return updatedLocalUser;
  }

  async remove(id: number) {
    const removedLocalUser = await this.prisma.user.delete({ where: { id } });
    if (!removedLocalUser) {
      throw new Error(`User with id ${id} not found`);
    }
    console.log('deleted directly local');
    return removedLocalUser;
  }

  // async hashPassword(password: string) {
  //   const salt = await bcrypt.genSaltSync();
  //   return bcrypt.hash(password, salt);
  // }
}
