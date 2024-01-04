import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserStatisticsEntity } from './entities/user-statistics.entity';
import { UserLoginEntity } from './entities/user-logins.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserStatisticsEntity,
      UserLoginEntity,
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
