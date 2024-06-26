import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { FileEntity } from './files/entities/file.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserStatisticsEntity } from './users/entities/user-statistics.entity';
import { SharedFileEntity } from './files/entities/shared-files.entity';
import { FileActivityLogEntity } from './files/entities/file-activity-log.entity';
import { UserLoginEntity } from './users/entities/user-logins.entity';
@Module({
  imports: [
    UsersModule,
    FilesModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        FileEntity,
        UserStatisticsEntity,
        SharedFileEntity,
        FileActivityLogEntity,
        UserLoginEntity,
      ],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
