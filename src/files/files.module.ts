import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { UsersModule } from 'src/users/users.module';
import { FileActivityLogEntity } from './entities/fileActivityLogEntity';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    TypeOrmModule.forFeature([FileEntity, FileActivityLogEntity]),
    UsersModule,
  ],
})
export class FilesModule {}
