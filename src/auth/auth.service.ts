//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionEntity } from 'src/sessions/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async login(
    email: string,
    password: string,
    userAgent: string,
  ): Promise<SessionEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT token containing the user's ID and return it
    const accessToken = this.jwtService.sign({ userId: user.id });
    await this.sessionsService.create({
      accessToken,
      userAgent,
      userId: user.id,
    });
    return new SessionEntity(await this.sessionsService.findOne(accessToken));
  }
}
