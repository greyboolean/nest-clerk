import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';
import { LocalUsersService } from '../users/local-users.service';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import { UpdateLocalUserDto } from '../users/dto/update-local-user.dto';
import { ClerkUsersService } from 'src/clerk/clerk-users.service';
import { UpdateClerkUserDto } from 'src/clerk/dto/update-clerk-user.dto';
import { Role } from '../users/enums/role.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WebhookService {
  constructor(
    private configService: ConfigService,
    private localUsersService: LocalUsersService,
    private clerkUsersService: ClerkUsersService,
  ) {}

  async handleWebhook(
    payload: any,
    svix_id: string,
    svix_timestamp: string,
    svix_signature: string,
  ) {
    const event = this.verifyWebhook(
      payload,
      svix_id,
      svix_timestamp,
      svix_signature,
    );

    const data = event.data;

    switch (event.type) {
      case 'user.created':
        return this.handleUserCreated(data);
      case 'user.updated':
        return this.handleUserUpdated(data);
      case 'user.deleted':
        return this.handleUserDeleted(data);
      default:
        throw new BadRequestException('Invalid event type');
    }
  }

  verifyWebhook(
    payload: any,
    svix_id: string,
    svix_timestamp: string,
    svix_signature: string,
  ) {
    // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
    const WEBHOOK_SECRET = this.configService.get('WEBHOOK_SECRET');
    if (!WEBHOOK_SECRET) {
      throw new InternalServerErrorException('Webhook secret not provided');
    }

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new BadRequestException('Svix headers are missing');
    }

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let event: WebhookEvent;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'event'
    // If the verification fails, error out and  return error code
    try {
      event = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      throw new BadRequestException('Webhook verification failed');
    }

    // Return the event
    return event;
  }

  async handleUserCreated(data: any) {
    const clerkId = data.id;
    const email = data.email_addresses[0].email_address;
    const roles = [Role.User];
    const createLocalUserDto: CreateLocalUserDto = {
      clerkId,
      email,
      roles,
    };
    const updateClerkUserDto: UpdateClerkUserDto = {
      publicMetadata: { roles },
    };
    let createdLocalUser: User;
    try {
      createdLocalUser = await this.localUsersService.findOneByClerkId(clerkId);
      // createdLocalUser = await this.localUsersService.update(
      //   existingLocalUser.id,
      //   createLocalUserDto,
      // );
      console.log('created webhook local');
    } catch (error) {
      if (error instanceof NotFoundException) {
        createdLocalUser =
          await this.localUsersService.create(createLocalUserDto);
        await this.clerkUsersService.update(clerkId, updateClerkUserDto);
        // createdLocalUser = {
        //   clerkId: updatedClerkUser.id,
        //   email: updatedClerkUser.emailAddresses[0].emailAddress,
        //   roles: updatedClerkUser.publicMetadata.roles as Role[],
        // };
      } else {
        throw error;
      }
      console.log('created webhook clerk');
    }
    return createdLocalUser;
  }

  async handleUserUpdated(data: any) {
    const clerkId = data.id;
    const email = data.email_addresses[0].email_address;
    const roles = data.public_metadata.roles || ['user'];
    const updateLocalUserDto: UpdateLocalUserDto = {
      clerkId,
      email,
      roles,
    };
    const existingLocalUser =
      await this.localUsersService.findOneByClerkId(clerkId);
    const updatedLocalUser = await this.localUsersService.update(
      existingLocalUser.id,
      updateLocalUserDto,
    );
    console.log('updated clerk');
    return updatedLocalUser;
  }

  async handleUserDeleted(data: any) {
    const clerkId = data.id;
    let deletedLocalUser;
    try {
      const existingLocalUser =
        await this.localUsersService.findOneByClerkId(clerkId);
      deletedLocalUser = await this.localUsersService.remove(
        existingLocalUser.id,
      );
      console.log('deleted webhook clerk');
    } catch (error) {
      if (error instanceof NotFoundException) {
        deletedLocalUser = { clerkId };
      } else {
        throw error;
      }
      console.log('deleted webhook local');
    }
    return deletedLocalUser;
  }
}
