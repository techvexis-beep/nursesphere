import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class NotificationService {
  constructor(private eventsGateway: EventsGateway) {}

  async sendNotification(userId: string, notification: {
    type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
    title: string;
    message: string;
    data?: any;
  }) {
    this.eventsGateway.sendNotificationToUser(userId, {
      ...notification,
      createdAt: new Date().toISOString(),
    });
  }

  async sendProgressUpdate(userId: string, progress: {
    migrationScore?: number;
    examScore?: number;
    clinicalHours?: number;
    jobReadiness?: number;
  }) {
    this.eventsGateway.sendProgressUpdate(userId, {
      ...progress,
      updatedAt: new Date().toISOString(),
    });
  }

  async notifyExamResult(userId: string, result: {
    examId: string;
    score: number;
    passed: boolean;
    details?: any;
  }) {
    this.eventsGateway.broadcastExamResult(userId, {
      ...result,
      timestamp: new Date().toISOString(),
    });
  }

  async notifyNewJob(userId: string, job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
  }) {
    this.eventsGateway.broadcastJobAlert(userId, {
      ...job,
      timestamp: new Date().toISOString(),
    });
  }

  async notifyAchievement(userId: string, achievement: {
    id: string;
    title: string;
    description: string;
    icon?: string;
  }) {
    this.eventsGateway.broadcastAchievement(userId, {
      ...achievement,
      unlockedAt: new Date().toISOString(),
    });
  }

  async broadcast(message: {
    type: string;
    title: string;
    message: string;
  }) {
    this.eventsGateway.broadcastToAll('broadcast', {
      ...message,
      timestamp: new Date().toISOString(),
    });
  }
}
