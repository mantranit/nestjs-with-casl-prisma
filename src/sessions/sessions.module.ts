import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SessionsService],
  imports: [PrismaModule],
  exports: [SessionsService],
})
export class SessionsModule {}
