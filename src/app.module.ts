import { Module } from '@nestjs/common';
import { AppGateway } from './websocket/websocket.gateway';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
