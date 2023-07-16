import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication';
import { ConfigurationModule } from './configuration';
import { DatabaseModule } from './database';
import { SubjectModules } from './subjects';
import { UserModule } from './subjects/user/user.module';
import { SocketModule } from './socket';
import { StaticModule } from './static/static.module';

@Module({
  imports: [
    ...SubjectModules,
    DatabaseModule,
    AuthenticationModule,
    ConfigurationModule,
    UserModule,
    SocketModule,
    StaticModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
