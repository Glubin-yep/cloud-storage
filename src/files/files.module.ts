import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { UsersModule } from 'src/users/users.module';
import { FileActivityLogEntity } from './entities/fileActivityLogEntity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedFileEntity } from './entities/shared_files.entity';


@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('SHARED_LINK_SECRET_KEY'),
          signOptions: { expiresIn: configService.get('SHARED_LINK_EXPIRES_IN') },
        };
      },
    }),
    TypeOrmModule.forFeature([FileEntity, FileActivityLogEntity, SharedFileEntity]),
    UsersModule,
  ],
})
export class FilesModule {}
