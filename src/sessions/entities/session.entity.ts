// src/articles/entities/article.entity.ts

import { Session } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { Exclude } from 'class-transformer';

export class SessionEntity implements Session {
  constructor({ user, ...data }: Partial<SessionEntity>) {
    Object.assign(this, data);
    this.user = new UserEntity(user);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty({ required: false, nullable: true })
  refreshToken: string | null;

  @ApiProperty()
  userAgent: string;

  @ApiProperty()
  createdAt: Date;

  @Exclude()
  userId: string;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
