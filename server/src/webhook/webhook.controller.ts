import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  handleWebhook(@Req() req: RawBodyRequest<Request>) {
    // Get the Svix headers for verification
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;
    const payload = req.rawBody;

    return this.webhookService.handleWebhook(
      payload,
      svix_id,
      svix_timestamp,
      svix_signature,
    );
  }
}
