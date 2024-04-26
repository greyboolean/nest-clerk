import { Injectable } from '@nestjs/common';
import { CreateClerkUserDto } from './dto/create-clerk-user.dto';
import { UpdateClerkUserDto } from './dto/update-clerk-user.dto';
import clerkClient from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkUsersService {
  async create(createClerkUserDto: CreateClerkUserDto) {
    const createdClerkUser =
      await clerkClient.users.createUser(createClerkUserDto);
    return createdClerkUser;
  }

  async findAll() {
    const users = await clerkClient.users.getUserList();
    return users;
  }

  findOne(id: string) {
    const user = clerkClient.users.getUser(id);
    return user;
  }

  async update(userId: string, updateClerkUserDto: UpdateClerkUserDto) {
    const updatedClerkUser = await clerkClient.users.updateUser(
      userId,
      updateClerkUserDto,
    );
    return updatedClerkUser;
  }

  async remove(userId: string) {
    const deletedClerkUser = await clerkClient.users.deleteUser(userId);
    return deletedClerkUser;
  }
}
