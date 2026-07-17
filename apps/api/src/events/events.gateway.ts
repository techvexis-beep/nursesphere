import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, { userId: string; socketId: string }>();

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
    
    setInterval(() => {
      this.sendHeartbeat();
    }, 30000);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.log('No token provided, disconnecting client');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub || payload.id;
      
      this.connectedClients.set(client.id, { userId, socketId: client.id });
      
      console.log(`Client connected: ${client.id}, User: ${userId}`);
      console.log(`Total connected clients: ${this.connectedClients.size}`);

      client.emit('connected', {
        message: 'Connected to NurseSphere WebSocket',
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.log('Authentication failed:', (error as Error).message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const clientData = this.connectedClients.get(client.id);
    if (clientData) {
      console.log(`Client disconnected: ${client.id}, User: ${clientData.userId}`);
      this.connectedClients.delete(client.id);
    }
    console.log(`Total connected clients: ${this.connectedClients.size}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  @SubscribeMessage('subscribe:notifications')
  handleSubscribeNotifications(client: Socket) {
    const clientData = this.connectedClients.get(client.id);
    if (clientData) {
      client.join(`user:${clientData.userId}`);
      console.log(`User ${clientData.userId} subscribed to notifications`);
    }
  }

  @SubscribeMessage('subscribe:progress')
  handleSubscribeProgress(client: Socket) {
    const clientData = this.connectedClients.get(client.id);
    if (clientData) {
      client.join(`progress:${clientData.userId}`);
      console.log(`User ${clientData.userId} subscribed to progress updates`);
    }
  }

  private sendHeartbeat() {
    this.server.emit('heartbeat', { timestamp: new Date().toISOString() });
  }

  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  sendProgressUpdate(userId: string, progress: any) {
    this.server.to(`progress:${userId}`).emit('progress_update', progress);
  }

  broadcastExamResult(userId: string, result: any) {
    this.server.to(`user:${userId}`).emit('exam_result', result);
  }

  broadcastJobAlert(userId: string, job: any) {
    this.server.to(`user:${userId}`).emit('job_alert', job);
  }

  broadcastAchievement(userId: string, achievement: any) {
    this.server.to(`user:${userId}`).emit('achievement', achievement);
  }

  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
