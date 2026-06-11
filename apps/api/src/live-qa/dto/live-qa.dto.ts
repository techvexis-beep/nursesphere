import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  regulatorId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  scheduledAt: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isRecorded?: boolean;
}

export class UpdateSessionDto {
  @IsString()
  @IsOptional()
  regulatorId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  streamUrl?: string;
}

export class AnswerQuestionDto {
  @IsString()
  regulatorId: string;

  @IsString()
  answer: string;
}

export class AddQuestionDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  question: string;
}
