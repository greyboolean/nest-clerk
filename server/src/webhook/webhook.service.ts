import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class WebhookService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
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
    console.log('User created:', data);
    const createUserDto: CreateUserDto = {
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
    };
    return this.usersService.create(createUserDto);
  }

  async handleUserUpdated(data: any) {
    console.log('User updated:', data);
    const updateUserDto: UpdateUserDto = {
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
    };
    const user = await this.usersService.findOneByClerkId(data.id);
    return this.usersService.update(user.id, updateUserDto);
  }

  async handleUserDeleted(data: any) {
    console.log('User deleted:', data);
    const user = await this.usersService.findOneByClerkId(data.id);
    return this.usersService.remove(user.id);
  }
}
