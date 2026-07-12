import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'NURSE_STUDENT', 'LICENSED_NURSE', 'MIGRATING_NURSE', 'NURSE_ADVOCATE', 'REGULATORY_BODY', 'INSTITUTION'])
  role?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
