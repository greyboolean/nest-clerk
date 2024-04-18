import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(private configService: ConfigService) {}

  handleWebhook(
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

    switch (event.type) {
      case 'user.created':
        this.handleUserCreated(event);
        break;
      case 'user.updated':
        this.handleUserUpdated(event);
        break;
      case 'user.deleted':
        this.handleUserDeleted(event);
        break;
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

  handleUserCreated(event: WebhookEvent) {
    console.log('User created:', event.data);
  }

  handleUserUpdated(event: WebhookEvent) {
    console.log('User updated:', event.data);
  }

  handleUserDeleted(event: WebhookEvent) {
    console.log('User deleted:', event.data);
  }
}
