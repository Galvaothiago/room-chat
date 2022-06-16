import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

interface User {
    id: string,
    username: string
}

interface PayloadProp {
    created_at: string,
    message: string,
    username: string
}

@WebSocketGateway({ cors: "*" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private logger: Logger = new Logger('AppGateway')
    private users: User[] = []

    @SubscribeMessage('MessageServer')
    handleMessage(client: Socket, payload: PayloadProp) {

        const equalUser = (({ username }) =>  username === payload.username)
        const hasUser = this.users.some(equalUser)

        if(!hasUser) {
            this.users.push({ id: client.id, username: payload.username })
        }

        this.server.emit('newMessage', payload, client.id)
    }

    afterInit(server: Server) {
        this.logger.log('web socket started')
    }

    handleConnection(client: Socket) {
        const message = `${client.id} connected!`
        this.server.emit('newUser', message)
        this.logger.log('new user conneted', client.id)
    }

    handleDisconnect(client: Socket) {
        if(!this.users) {
            return
        }
        
        const whichUserLeft = this.users.find(({ id }) => id === client.id)
        const remainingUsers = this.users.filter(({ id }) => id !== whichUserLeft.id)

        this.users = remainingUsers
        this.server.emit('userDisconnected', whichUserLeft)   
    }
}