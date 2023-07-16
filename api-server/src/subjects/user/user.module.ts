import { Module } from '@nestjs/common';
import { UserService } from './application';
import { UserController } from './presentation';
import { createMulterModule } from 'src/file';

@Module({
  imports: [createMulterModule('users')],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
