import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

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
      const userDate = await this.userService.create(dto);

      return {
        token: this.jwtService.sign({ id: userDate.id }),
      };
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Error during registration');
    }
  }

  async login(user: UserEntity) {  

    return {
      token: this.jwtService.sign({id: user.id}),
    };
  }
}
