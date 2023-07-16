import { RefreshTokenDto } from './../dto/refresh-token';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { BearerTokenService } from 'src/authentication/services/bearer-token.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { v4 } from 'uuid';
import { UserProfile } from '../../../type/user';
import { SignupDto } from '../dto/signup.dto';
import { LogoutDto } from '../dto/logoutDto';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService, //데이터 베이스를 관리하기 위함
    private readonly _tokenService: BearerTokenService,
  ) {}

  async createTokens(user: UserProfile) {
    const accessToken = this._tokenService.sign(user);
    const refreshToken = v4();
    const data = { value: refreshToken, userId: user.id };
    await this._prisma.token.create({ data });

    return { accessToken, refreshToken };
  }

  async signup(data: SignupDto) {
    const { email } = data;
    const exUser = await this._prisma.user.findUnique({ where: { email } });
    console.log('생성');
    if (exUser) {
      throw new ConflictException('이미 존재하는 이메일 입니다');
    }
    data.password = hashSync(data.password, 12);
    //기본 이미지 설정
    data.image = 'users/defaultImage.jpeg';
    await this._prisma.user.create({
      data: { ...data, role: UserRole.member },
    });
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken: value } = dto;
    const row = await this._prisma.token.findUnique({ where: { value } });
    if (!row) throw new UnauthorizedException();
    const { userId: id } = row;
    const user = await this._prisma.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException();

    const payload: UserProfile = {
      id: user.id,
      role: user.role as UserRole,
    };

    const accessToken = this._tokenService.sign(payload);
    const refreshToken = v4();
    await this._prisma.token.update({
      where: { id: row.id },
      data: { value: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async logout(dto: LogoutDto) {
    console.log('삭제 명령');
    const { refreshToken: value } = dto;
    await this._prisma.token.delete({ where: { value } });
  }

  async getMe(user: UserProfile) {
    const id = user.id;
    const userData = await this._prisma.user.findUnique({ where: { id } });
    console.log('getme 실행됨');
    return this._prisma.exclude(userData, ['password']);
  }
}
