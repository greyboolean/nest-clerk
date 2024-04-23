import clerkClient from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token =
      this.extractTokenFromCookie(request) ||
      this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('User is not authenticated');
    }

    try {
      const payload = await clerkClient.verifyToken(request.cookies.__session);
      console.log('payload');
      console.log(payload);
      // console.log(await clerkClient.users.getUserList());
      const user = await clerkClient.users.getUser(payload.sub);
      console.log('user');
      console.log(user);
    } catch (err) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.__session;
  }
}
