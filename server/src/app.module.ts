import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';
import { ClerkModule } from './clerk/clerk.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    WebhookModule,
    ClerkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
