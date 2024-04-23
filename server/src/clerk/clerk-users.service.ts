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

  // findAll() {
  //   return `This action returns all clerk`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} clerk`;
  // }

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
