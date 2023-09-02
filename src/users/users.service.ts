import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ){}

    async findByEmail(email: string){
      return this.repository.findOneBy({
        email,
      })
    }
  
    async findById(id: number){
      return this.repository.findOneBy({
        id,
      })
    }

    async create(dto: CreateUserDto){
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.repository.create({ ...dto, password: hashedPassword });
      return this.repository.save(user);
    }
}
