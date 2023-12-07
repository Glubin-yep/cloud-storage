import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginEntity } from 'src/users/entities/user_logins.entity';
import { Repository } from 'typeorm';
import * as UAParser from 'ua-parser-js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserLoginEntity)
    private userLoginRepository: Repository<UserLoginEntity>,
  ) {}

  async validateToken(token: string): Promise<any> {
    try {
      const isValid = await this.jwtService.verifyAsync(token);
      return isValid;
    } catch (error) {
      return {
        token: token,
        statusCode: 401,
      };
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const { password: hashedPassword, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException();
      }

      const userDate = await this.userService.create(dto);

      return {
        token: this.jwtService.sign({ id: userDate.id }),
        id: userDate.id,
        email: userDate.email,
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        console.error(err);
        throw new ConflictException('Email already exists');
      }
    }
  }

  async login(user: UserEntity, req: any) {
    const userAgent = req.headers['user-agent'];

    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'Desktop';

    await this.userLoginRepository.save({
      user: user,
      ipAddress: req.ip,
      browser: parser.getBrowser().name,
      platform: parser.getOS().name,
      deviceType: deviceType,
      userAgent: userAgent,
      loginTime: new Date(),
    });

    return {
      token: this.jwtService.sign({ id: user.id }),
      id: user.id,
      email: user.email,
    };
  }

  async Logout() {
    //rewrite auth placeholder to normal access/refresh logic

    return {
      message: 'Logout successful',
    };
  }
}
