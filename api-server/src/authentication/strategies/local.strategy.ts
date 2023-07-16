import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { Strategy } from 'passport-local';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserProfile } from '../../type/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _prisma: PrismaService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserProfile> {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException();
    if (!compareSync(password, user.password))
      throw new UnauthorizedException();
    const { id, role } = user;
    return {
      id,
      role: role as UserRole,
    };
  }
} // 들어온 값 email password가 데이터베이스에 있는것인지 확인
