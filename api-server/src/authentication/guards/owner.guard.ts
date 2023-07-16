import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { UserProfile } from 'src/type/user';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private _reflector: Reflector, private _prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this._reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    const request: any = context.switchToHttp().getRequest();
    const user: UserProfile | undefined = request.user;

    const url: string = request.url;
    const pattern = /\/project\/(\d+)/;
    const result: RegExpMatchArray | null = url.match(pattern);

    if (result) {
      const id = Number(result[1]);
      const proj = await this._prisma.project.findUnique({ where: { id } });

      if (roles.includes(user.role) || proj.userId == user.id) {
        return true;
      }
    }

    throw new ForbiddenException();
  }
}
