import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LoginRequired } from 'src/authentication/decorators/login-require';
import { OperatorRoleRequired } from 'src/authentication/decorators/role-required';
import { User } from 'src/authentication/decorators/user.decorator';
import { UserProfile } from 'src/type/user';
import { UserService } from '../application';
import { FileInterceptor } from '@nestjs/platform-express';
//import { ApiTags } from '@nestjs/swagger';

//@ApiTags('User APIs')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @LoginRequired
  @Get('me')
  findUser(@User() user: UserProfile) {
    return this._userService.findUser(user.id);
  }

  @LoginRequired
  @UseInterceptors(FileInterceptor('file'))
  @Post('me/image')
  async uploadImage(
    @User() user: UserProfile,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this._userService.createUserImag(file, user.id);
  }

  @OperatorRoleRequired
  @Get('all')
  findUsers() {
    return this._userService.findUsers();
  }
}
