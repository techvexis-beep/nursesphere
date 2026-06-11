import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateClinicalLogDto {
  @IsString()
  caseTitle: string;

  @IsString()
  caseType: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  patientAge?: number;

  @IsOptional()
  @IsString()
  patientGender?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  intervention?: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  supervisorName?: string;
}

export class UpdateClinicalLogDto {
  @IsOptional()
  @IsString()
  caseTitle?: string;

  @IsOptional()
  @IsString()
  caseType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  patientAge?: number;

  @IsOptional()
  @IsString()
  patientGender?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  intervention?: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  supervisorName?: string;
}
