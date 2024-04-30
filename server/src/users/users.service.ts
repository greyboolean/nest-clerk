import { Injectable } from '@nestjs/common';
import { ClerkUsersService } from 'src/clerk/clerk-users.service';
import { LocalUsersService } from './local-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateClerkUserDto } from 'src/clerk/dto/create-clerk-user.dto';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { UpdateClerkUserDto } from 'src/clerk/dto/update-clerk-user.dto';
import { UpdateLocalUserDto } from './dto/update-local-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private clerkUsersService: ClerkUsersService,
    private localUsersService: LocalUsersService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const roles = createUserDto.roles?.length ? createUserDto.roles : ['user'];
    const createClerkUserDto: CreateClerkUserDto = {
      emailAddress: [createUserDto.email],
      password: createUserDto.password,
      publicMetadata: { roles },
    };
    const createdClerkUser =
      await this.clerkUsersService.create(createClerkUserDto);
    const CreateLocalUserDto: CreateLocalUserDto = {
      clerkId: createdClerkUser.id,
      email: createdClerkUser.emailAddresses[0].emailAddress,
      roles,
    };
    const createdLocalUser =
      await this.localUsersService.create(CreateLocalUserDto);
    return createdLocalUser;
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
    const updateClerkUserDto: UpdateClerkUserDto = {
      password: updateUserDto.password,
      skipPasswordChecks: updateUserDto.skipPasswordChecks,
      publicMetadata: { roles: updateUserDto.roles },
    };
    const localUser = await this.localUsersService.findOne(id);
    const clerkId = localUser.clerkId;
    const updatedClerkUser = await this.clerkUsersService.update(
      clerkId,
      updateClerkUserDto,
    );
    const updateLocalUserDto: UpdateLocalUserDto = {
      clerkId: updatedClerkUser.id,
      email: updatedClerkUser.emailAddresses[0].emailAddress,
      roles: updatedClerkUser.publicMetadata.roles as string[],
    };
    const updatedLocalUser = await this.localUsersService.update(
      id,
      updateLocalUserDto,
    );
    return updatedLocalUser;
  }

  async remove(id: number) {
    const localUser = await this.localUsersService.findOne(id);
    const clerkId = localUser.clerkId;
    await this.clerkUsersService.remove(clerkId);
    const deletedLocalUser = await this.localUsersService.remove(id);
    return deletedLocalUser;
  }
}
