import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class CreateReportDto {
  @IsString()
  reportType: string;

  @IsString()
  hospitalName: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  evidence?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class CreateSalaryReportDto {
  @IsString()
  hospitalName: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  department: string;

  @IsString()
  shiftType: string;

  @IsNumber()
  salaryMin: number;

  @IsNumber()
  salaryMax: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  nurseToPatientRatio?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
