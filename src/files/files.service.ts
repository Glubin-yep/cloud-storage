import { ActivityAction } from '@/enums/activity-action';
import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { FileActivityService } from './services/file-activity.service';
import { SharedFileService } from './services/shared-file.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private usersService: UsersService,
    private fileActivityService: FileActivityService,
    private sharedFileService: SharedFileService,
  ) {}

  async create(file: Express.Multer.File, userId: number) {
    await this.usersService.updateUserStatistics(userId, 1, file.size, 1, 0);
    const savedFile = await this.repository.save({
      filename: file.filename,
      originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });

    await this.fileActivityService.logActivity(
      userId,
      savedFile.id,
      ActivityAction.CREATE,
    );

    return savedFile;
  }

  async findAll(userId: number) {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  async getFileStream(userId: number, fileId: number) {
    const file = await this.findOne(userId, fileId);

    await this.usersService.updateUserStatistics(userId, 0, 0, 0, 1);
    await this.fileActivityService.logActivity(
      userId,
      fileId,
      ActivityAction.DOWNLOAD,
    );

    const path = `uploads/${file.filename}`;
    const fileStream = createReadStream(path);

    return { fileStream, filename: file.originalName, fileType: file.mimetype };
  }

  async findOne(userId: number, fileId: number) {
    const file = await this.repository.findOne({
      where: { id: fileId, user: { id: userId } },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async remove(userId: number, id: number) {
    const file = await this.findOne(userId, id);

    await this.fileActivityService.logActivity(
      userId,
      id,
      ActivityAction.DELETE,
    );

    return this.repository.softDelete(file.id);
  }

  async getSharedLink(userId: number, fileId: number) {
    const file = await this.findOne(userId, fileId);

    return this.sharedFileService.createSharedLink(userId, file);
  }

  async getFileIdBySharedToken(token: string) {
    return this.sharedFileService.getFileIdBySharedToken(token);
  }

  async getHistory(userId: number) {
    return this.fileActivityService.getHistory(userId);
  }
}
