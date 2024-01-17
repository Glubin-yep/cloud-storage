import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserResponseDto } from '@/users/dto/user-response.dto';
import { UserLoginEntity } from '@/users/entities/user-logins.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from './services/password.service';
import * as UAParser from 'ua-parser-js';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    @InjectRepository(UserLoginEntity)
    private userLoginRepository: Repository<UserLoginEntity>,
  ) {}

  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(email);

    if (user && (await this.passwordService.compare(password, user.password))) {
      return new UserResponseDto(user);
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.create(dto);

    return {
      token: this.jwtService.sign({ id: user.id }),
      ...new UserResponseDto(user),
    };
  }

  async login(user: UserEntity, req: Request) {
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'Desktop';

    await this.userLoginRepository.save({
      user: user,
      // ipAddress: req.ip,
      browser: parser.getBrowser().name,
      platform: parser.getOS().name,
      deviceType: deviceType,
      userAgent: userAgent,
      loginTime: new Date(),
    });

    return {
      token: this.jwtService.sign({ id: user.id }),
      ...new UserResponseDto(user),
    };
  }

  async logout() {
    return {
      message: 'Logout successful',
    };
  }

  async Githublogin(req: Request, gitUser: any) {
    const existingUser = await this.userService.findByOAuthGithubId(gitUser.id);
    if (!existingUser) {
      const dto: CreateUserDto = {
        OAuthGithubId: gitUser.id,
        email: gitUser.email,
        firstName: '',
        lastName: '',
        password: '',
      };
      const user = await this.userService.create(dto);

      return {
        token: this.jwtService.sign({ id: user.id }),
        ...new UserResponseDto(user),
      };
    }

    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'Desktop';

    await this.userLoginRepository.save({
      //user: user,
      //ipAddress: req.ip,
      browser: parser.getBrowser().name,
      platform: parser.getOS().name,
      deviceType: deviceType,
      userAgent: userAgent,
      loginTime: new Date(),
    });

    return {
      token: this.jwtService.sign({ id: existingUser.id }),
      ...new UserResponseDto(gitUser),
    };
  }
}
