import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LiveQAService } from './live-qa.service';

interface JoinRoomPayload {
  sessionId: string;
  userId?: string;
  role?: 'viewer' | 'moderator';
}

interface AskQuestionPayload {
  sessionId: string;
  userId?: string;
  question: string;
}

interface AnswerQuestionPayload {
  questionId: string;
  answer: string;
}

interface UpvoteQuestionPayload {
  questionId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/live-qa',
})
export class LiveQAGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers: Map<string, { sessionId: string; userId?: string; role: string }> = new Map();

  constructor(private liveQAService: LiveQAService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user = this.activeUsers.get(client.id);
    if (user) {
      client.to(`session:${user.sessionId}`).emit('user_left', {
        clientId: client.id,
        sessionId: user.sessionId,
      });
      this.activeUsers.delete(client.id);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { sessionId, userId, role = 'viewer' } = payload;

    // Join the socket room
    await client.join(`session:${sessionId}`);

    // Track active user
    this.activeUsers.set(client.id, { sessionId, userId, role });

    // Increment attendee count
    try {
      await this.liveQAService.incrementAttendeeCount(sessionId);
    } catch (e) {
      // Ignore errors
    }

    // Notify others in the room
    client.to(`session:${sessionId}`).emit('user_joined', {
      clientId: client.id,
      userId,
      role,
      totalAttendees: this.getSessionAttendees(sessionId),
    });

    // Send current attendee count to the joining user
    client.emit('attendee_count', {
      sessionId,
      count: this.getSessionAttendees(sessionId),
    });

    return { success: true, sessionId, role };
  }

  @SubscribeMessage('leave_session')
  async handleLeaveSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string },
  ) {
    const { sessionId } = payload;

    await client.leave(`session:${sessionId}`);
    this.activeUsers.delete(client.id);

    client.to(`session:${sessionId}`).emit('user_left', {
      clientId: client.id,
      sessionId,
    });

    return { success: true };
  }

  @SubscribeMessage('ask_question')
  async handleAskQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AskQuestionPayload,
  ) {
    const { sessionId, userId, question } = payload;

    // Save question to database
    const savedQuestion = await this.liveQAService.addQuestion(sessionId, userId || null, question);

    // Broadcast to all in the session
    this.server.to(`session:${sessionId}`).emit('new_question', savedQuestion);

    // If there's a moderator, notify them
    this.server.to(`session:${sessionId}`).emit('notification', {
      type: 'new_question',
      message: 'New question submitted',
      questionId: savedQuestion.id,
    });

    return { success: true, question: savedQuestion };
  }

  @SubscribeMessage('answer_question')
  async handleAnswerQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AnswerQuestionPayload & { moderatorId: string },
  ) {
    const { questionId, answer, moderatorId } = payload;

    // Save answer to database
    const updatedQuestion = await this.liveQAService.answerQuestion(moderatorId, questionId, answer);

    // Broadcast to all in the session
    this.server.to(`session:${updatedQuestion.sessionId}`).emit('question_answered', updatedQuestion);

    return { success: true, question: updatedQuestion };
  }

  @SubscribeMessage('upvote_question')
  async handleUpvoteQuestion(
    @MessageBody() payload: UpvoteQuestionPayload,
  ) {
    const { questionId } = payload;

    const updatedQuestion = await this.liveQAService.upvoteQuestion(questionId);

    // Broadcast the updated upvotes
    this.server.emit('question_upvoted', {
      questionId,
      upvotes: updatedQuestion.upvotes,
    });

    return { success: true, upvotes: updatedQuestion.upvotes };
  }

  @SubscribeMessage('start_session')
  async handleStartSession(
    @MessageBody() payload: { sessionId: string; streamUrl: string },
  ) {
    const { sessionId, streamUrl } = payload;

    // Update session status in database
    await this.liveQAService.startSession('', sessionId, streamUrl);

    // Broadcast to all listeners
    this.server.emit('session_started', {
      sessionId,
      streamUrl,
      startedAt: new Date(),
    });

    return { success: true };
  }

  @SubscribeMessage('end_session')
  async handleEndSession(
    @MessageBody() payload: { sessionId: string },
  ) {
    const { sessionId } = payload;

    // Update session status in database
    await this.liveQAService.endSession('', sessionId);

    // Broadcast to all listeners
    this.server.to(`session:${sessionId}`).emit('session_ended', {
      sessionId,
      endedAt: new Date(),
    });

    return { success: true };
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string; message: string; userId?: string; userName?: string },
  ) {
    const { sessionId, message, userId, userName } = payload;

    // Broadcast message to all in the session
    this.server.to(`session:${sessionId}`).emit('chat_message', {
      id: Date.now().toString(),
      sessionId,
      message,
      userId,
      userName: userName || 'Anonymous',
      timestamp: new Date(),
    });

    return { success: true };
  }

  private getSessionAttendees(sessionId: string): number {
    let count = 0;
    this.activeUsers.forEach((user) => {
      if (user.sessionId === sessionId) count++;
    });
    return count;
  }
}
