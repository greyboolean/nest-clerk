import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import clerkClient from '@clerk/clerk-sdk-node';
import { LocalUsersService } from 'src/users/local-users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private localUserService: LocalUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token =
      this.extractTokenFromCookie(request) ||
      this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('User is not authenticated');
    }

    try {
      const payload = await clerkClient.verifyToken(request.cookies.__session);
      const user = await this.localUserService.findOneByClerkId(payload.sub);
      request['user'] = user;
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
