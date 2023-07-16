import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/type/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private _reflector: Reflector) {}

  //guard에 입력한 role을 가져오는 과정
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this._reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    //console.log(roles);
    if (!roles) return true;

    //acess토큰을 이용해서 유저 정보를 가져오는 과정
    const request: any = context.switchToHttp().getRequest();
    const user: UserProfile | undefined = request.user;
    //입력받은 role과 현재 유저의 role를 비교해서 결과출력
    if (!user || !roles.includes(user.role)) throw new ForbiddenException();

    return true;
  }
}
