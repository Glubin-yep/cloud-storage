import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatisticsEntity } from './entities/user_statistics.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(UserStatisticsEntity)
    private userStatisticsRepository: Repository<UserStatisticsEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.repository.findOneBy({
      email,
    });
  }

  async findById(id: number) {
    return this.repository.findOneBy({
      id,
    });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.repository.create({ ...dto, password: hashedPassword });
    await this.repository.save(user);

    const userStatistics = this.userStatisticsRepository.create({
      user,
    });
    await this.userStatisticsRepository.save(userStatistics);

    return user;
  }

  async updateUserStatistics(
    userId: number,
    totalFiles: number,
    usedStorage: number,
    uploadedFiles: number,
    downloadedFiles: number,
  ) {
    const userStatistics = await this.userStatisticsRepository.findOne({
      where: { user: { id: userId } },
    });
    console.log(usedStorage)
    if (userStatistics) {
      userStatistics.totalFiles += totalFiles;
      userStatistics.usedStorage += usedStorage;
      userStatistics.uploadedFiles += uploadedFiles;
      userStatistics.downloadedFiles += downloadedFiles;
      await this.userStatisticsRepository.save(userStatistics);
    }
  }

  async getUserStatistics(userId: number) {
    const userStatistics = await this.userStatisticsRepository.findOne({
      where: { user: { id: userId } },
    });

    return userStatistics;
  }
}
