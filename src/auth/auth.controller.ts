import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Response } from 'express';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: CreateUserDto })
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user as UserEntity, req);

    res.cookie('Authorization', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 60 * 360,
    });

    // Send a response without using res.send()
    res.status(200).end();
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Get('logout')
  async logout(@Res() res) {
    res.cookie('Authorization', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: new Date(0),
    });
    res.status(200).end();
  }

  @Get('validate')
  async Validate(@Request() req) {
    const cookie = req.cookies['Authorization']; // Access cookies with 'cookies' (plural)
    console.log(cookie);
    return this.authService.validateToken(cookie.token);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Request() req, @Res() res) {
    try {
      const user = req.user;
      const token = await this.authService.Githublogin(req, user);
      res.cookie('Authorization', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 60 * 360,
      });

      res.redirect(process.env.FRONTEND_URL);

      return;
    } catch (error) {
      console.error('GitHub login callback error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
