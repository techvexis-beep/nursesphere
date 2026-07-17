import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private store = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    setInterval(() => this.cleanup(), windowMs);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  private getKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const route = request.route?.path || request.url;
    return `${ip}:${route}`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const key = this.getKey(context);
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
    } else {
      entry.count++;
      if (entry.count > this.maxRequests) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((entry.resetTime - now) / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    return next.handle();
  }
}
