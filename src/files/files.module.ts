import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileActivityLogEntity } from './entities/file-activity-log.entity';
import { FileEntity } from './entities/file.entity';
import { SharedFileEntity } from './entities/shared-files.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileActivityService } from './services/file-activity.service';
import { SharedFileService } from './services/shared-file.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileActivityService, SharedFileService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('SHARED_LINK_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get('SHARED_LINK_EXPIRES_IN'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      FileEntity,
      FileActivityLogEntity,
      SharedFileEntity,
    ]),
    UsersModule,
  ],
})
export class FilesModule {}
