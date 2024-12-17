//src/auth/auth.controller.ts

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SessionEntity } from 'src/sessions/entities/session.entity';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: SessionEntity })
  login(@Body() { email, password }: LoginDto, @Req() req: Request) {
    return this.authService.login(email, password, req.headers['user-agent']);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async me(@Req() req: any) {
    return req.user;
  }
}
