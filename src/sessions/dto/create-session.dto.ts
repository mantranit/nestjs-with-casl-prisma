// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  refreshToken?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
