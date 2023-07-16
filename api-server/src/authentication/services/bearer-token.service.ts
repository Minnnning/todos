import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '../../type/user';

@Injectable()
export class BearerTokenService {
  constructor(private readonly _jwtService: JwtService) {}

  verify(BearerToken: string): UserProfile {
    const token = BearerToken.replace(/^Bearer /, '');
    return this._jwtService.verify(token);
  } //토근 검즌 유효한 경우 유저를 반환 (검증)
  sign(payload: UserProfile): string {
    return this._jwtService.sign(payload);
  } //유저 프로파일을 jwt반환 (생성)
}
//service에 사용된다
