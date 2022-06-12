import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({ cors: "*" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private logger: Logger = new Logger('AppGateway')

    @SubscribeMessage('MessageServer')
    handleMessage(client: Socket, payload: string) {
        this.server.emit('newMessage', payload, client.id)
        console.log(payload)
    }

    afterInit(server: Server) {
        this.logger.log('web socket started')


    }

    handleConnection(client: Socket) {
        const message = `${client.id} connected!`
        this.server.emit('newUser', message)
        this.logger.log('new user conneted', client.id)
    }

    handleDisconnect(cliente: Socket) {
        
    }

}