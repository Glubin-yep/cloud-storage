import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Response } from 'express';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserEntity } from '@/users/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: CreateUserDto })
  async login(@Request() req, @Res() res: Response) {
    const token = await this.authService.login(req.user as UserEntity, req);

    res.cookie('Authorization', token, { httpOnly: true });

    return res.send(token);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Get('logout')
  async logout() {
    return this.authService.logout();
  }

  @Get('validate/:token')
  async Validate(@Param('token') token: string) {
    return this.authService.validateToken(token);
  }
}
