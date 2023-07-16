import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/authentication/decorators/user.decorator';
import { UserProfile } from '../../../type/user';
import { AuthService } from '../application/auth.service';
import { RefreshTokenDto } from '../dto/refresh-token';
import { SignupDto } from '../dto/signup.dto';
import { LoginRequired } from 'src/authentication/decorators/login-require';
import { LogoutDto } from '../dto/logoutDto';
//import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { LoginRequestDto } from '../dto/loginRequestDto';
// import { loginResponseDto } from '../dto/loginResponseDto';

//@ApiTags('Auth APIs')
@Controller('auth') //클래스 데코레이터
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  // @ApiOperation({ summary: '로그인 api', description: '로그인 수행' })
  // @ApiBody({ type: LoginRequestDto })
  // @ApiResponse({ type: loginResponseDto, status: 200 })
  // @ApiResponse({
  //   schema: { example: new NotFoundException().getResponse() },
  //   status: HttpStatus.NOT_FOUND,
  // })
  // @ApiResponse({
  //   schema: { example: new UnauthorizedException().getResponse() },
  //   status: HttpStatus.UNAUTHORIZED,
  // })
  @UseGuards(AuthGuard('local')) //local은 strategy에 있는 local파일을 이용?
  @Post('login')
  login(@User() user: UserProfile) {
    return this._authService.createTokens(user);
  } //@User는 생성한 데코레이터로 파라미터로 들어갈때 한번 확인하는 과정?

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    await this._authService.signup(dto);
  }

  @Post('token/refresh')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this._authService.refreshToken(dto);
  }

  @Post('logout')
  async logout(@Body() dto: LogoutDto) {
    await this._authService.logout(dto);
  }

  @Get('getme')
  @LoginRequired //로그인 했는지 확인 하는 가드
  async getMe(@User() user: UserProfile) {
    return this._authService.getMe(user);
  }
}
