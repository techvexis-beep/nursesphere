import { IsOptional, IsString, IsDate, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMigrationDto {
  @IsOptional()
  @IsString()
  targetCountry?: string;

  @IsOptional()
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
  nclexStatus?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nclexDate?: Date;

  @IsOptional()
  @IsNumber()
  nclexScore?: number;

  @IsOptional()
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
  ieltsStatus?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ieltsDate?: Date;

  @IsOptional()
  @IsNumber()
  ieltsScore?: number;

  @IsOptional()
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
  oetStatus?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  oetDate?: Date;

  @IsOptional()
  @IsNumber()
  oetScore?: number;

  @IsOptional()
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
  credentialEvalStatus?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  credentialEvalDate?: Date;

  @IsOptional()
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
  visaStatus?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  visaDate?: Date;

  @IsOptional()
  @IsNumber()
  costEstimate?: number;
}
