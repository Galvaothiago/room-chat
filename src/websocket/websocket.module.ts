import { Module } from '@nestjs/common';
import { AppGateway } from './websocket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway],
})
export class WebsocketModule {}
