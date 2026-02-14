import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    emitNewIncident(data: any) {
        this.server.emit('new_incident', data);
    }

    @SubscribeMessage('ping')
    handlePing(@MessageBody() data: any) {
        return { event: 'pong', data };
    }
}
