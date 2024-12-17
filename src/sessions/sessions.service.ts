import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  create(createSessionDto: CreateSessionDto) {
    this.remove(createSessionDto.userId);
    return this.prisma.session.create({ data: createSessionDto });
  }

  findOne(accessToken: string) {
    return this.prisma.session.findFirst({
      where: { accessToken },
      include: {
        user: true,
      },
    });
  }

  remove(userId: string) {
    return this.prisma.session.deleteMany({ where: { userId } });
  }
}
