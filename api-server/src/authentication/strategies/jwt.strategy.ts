import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from 'src/configuration/factories/jwt.config';
import { UserProfile } from '../../type/user';

//login 데코에 사용?
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  } //복호화 과정?

  validate(payload: UserProfile): UserProfile {
    return payload;
  }
} //jwtFromReques로 헤더 bearer토큰 추출 유효한 경우 유저프로파일 반환
