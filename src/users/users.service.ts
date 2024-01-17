import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatisticsEntity } from './entities/user-statistics.entity';
import { UserLoginEntity } from './entities/user-logins.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserStatisticsEntity)
    private userStatisticsRepository: Repository<UserStatisticsEntity>,
    @InjectRepository(UserLoginEntity)
    private userLoginRepository: Repository<UserStatisticsEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async findByOAuthGithubId(OAuthGithubId: number) {
    return this.userRepository.findOneBy({
      OAuthGithubId,
    });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      OAuthGithubId: dto.OAuthGithubId ? Number(dto.OAuthGithubId) : null,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

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
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (userStatistics && user) {
      userStatistics.totalFiles += totalFiles;
      user.usedStorage += usedStorage;
      userStatistics.uploadedFiles += uploadedFiles;
      userStatistics.downloadedFiles += downloadedFiles;
      await this.userStatisticsRepository.save(userStatistics);
      await this.userRepository.save(user);
    }
  }

  async getUserStatistics(userId: number) {
    const userStatistics = await this.userStatisticsRepository.findOne({
      where: { user: { id: userId } },
    });

    return userStatistics;
  }

  async getUserStorage(userId: number) {
    const userStatistics = await this.userRepository.findOne({
      where: { id: userId },
    });

    return {
      maxStorage: userStatistics.maxStorage,
      usedStorage: userStatistics.usedStorage,
    };
  }

  async getActivity(userId: number) {
    const userActivity = await this.userLoginRepository.find({
      where: { user: { id: userId } },
    });

    return userActivity;
  }
}
