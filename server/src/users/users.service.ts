import { Injectable } from '@nestjs/common';
import { ClerkUsersService } from 'src/clerk/clerk-users.service';
import { LocalUsersService } from './local-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateClerkUserDto } from 'src/clerk/dto/create-clerk-user.dto';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { UpdateClerkUserDto } from 'src/clerk/dto/update-clerk-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private clerkUsersService: ClerkUsersService,
    private localUsersService: LocalUsersService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createClerkUserDto: CreateClerkUserDto = {
      emailAddress: [createUserDto.email],
      password: createUserDto.password,
    };
    const createdClerkUser =
      await this.clerkUsersService.create(createClerkUserDto);
    // // create a local user
    // // -- remove due to race conditions (because of webhook)
    // const CreateLocalUserDto: CreateLocalUserDto = {
    //   clerkId: createdClerkUser.id,
    //   email: createdClerkUser.emailAddresses[0].emailAddress,
    // };
    // const createdLocalUser =
    //   await this.localUsersService.create(CreateLocalUserDto);
    // return createdLocalUser;

    // -- race conditions: use transactions
    // send a user object created using clerkUser as response for the time being
    const clerkId = createdClerkUser.id;
    // add 5 seconds delay for the time being
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const localUser = await this.localUsersService.findOneByClerkId(clerkId);
    const user = {
      id: localUser.id,
      clerkId: createdClerkUser.id,
      email: createdClerkUser.emailAddresses[0].emailAddress,
    };
    return user;
  }

  async findAll() {
    const localUsers = await this.localUsersService.findAll();
    return localUsers;
  }

  findOne(id: number) {
    const localUser = this.localUsersService.findOne(id);
    return localUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateClerkUserDto: UpdateClerkUserDto = updateUserDto;
    const localUser = await this.localUsersService.findOne(id);
    const clerkId = localUser.clerkId;
    const updatedClerkUser = await this.clerkUsersService.update(
      clerkId,
      updateClerkUserDto,
    );
    // No updates in local database so far
    // send a user object using clerk user as response for the time being
    const user = {
      id: localUser.id,
      clerkId: updatedClerkUser.id,
      email: updatedClerkUser.emailAddresses[0].emailAddress,
    };
    return user;
  }

  async remove(id: number) {
    const user = await this.localUsersService.findOne(id);
    const clerkId = user.clerkId;
    await this.clerkUsersService.remove(clerkId);
    return user;
  }
}
