import { Module } from '@nestjs/common';
import { SocketGateway } from './gateways/socket.gateway';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
