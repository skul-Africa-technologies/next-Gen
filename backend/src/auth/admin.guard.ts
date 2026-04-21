import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminKey = request.headers['x-admin-key'];
    const validAdminKey = this.configService.get('ADMIN_KEY');

    if (!validAdminKey) {
      throw new UnauthorizedException('Admin key not configured');
    }

    if (adminKey !== validAdminKey) {
      throw new UnauthorizedException('Invalid admin key');
    }

    return true;
  }
}
