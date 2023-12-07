import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { createReadStream } from 'fs';
import { UsersService } from 'src/users/users.service';
import { FileActivityLogEntity } from './entities/fileActivityLogEntity';
import { JwtService } from '@nestjs/jwt';
import { SharedFileEntity } from './entities/shared_files.entity';

export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private usersService: UsersService,
    @InjectRepository(FileActivityLogEntity)
    private activityLogRepository: Repository<FileActivityLogEntity>,
    @InjectRepository(SharedFileEntity)
    private sharedFileRepository: Repository<SharedFileEntity>,
    private jwtService: JwtService,
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

    await this.logFileActivity(userId, savedFile.id, 'create');

    return savedFile;
  }

  async findAll(userId: number) {
    const qb = this.repository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    return qb.getMany();
  }

  async getFileStream(userId: number, fileId: number) {
    const file = await this.findOne(userId, fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.usersService.updateUserStatistics(userId, 0, 0, 0, 1);
    await this.logFileActivity(userId, fileId, 'download');

    const path = `uploads/${file.filename}`;
    const fileStream = createReadStream(path);

    return { fileStream, filename: file.originalName, fileType: file.mimetype };
  }

  async findOne(userId: number, fileId: number) {
    console.log(fileId);
    const file = await this.repository.findOne({
      where: { id: fileId, user: { id: userId } },
    });
    return file;
  }

  async remove(userId: number, ids: string) {
    const idsArray = ids.split(',');

    const qb = this.repository.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', {
      ids: idsArray,
      userId,
    });

    idsArray.forEach(async (element) => {
      await this.logFileActivity(userId, Number(element), 'delete');
    });

    return qb.softDelete().execute();
  }

  async getSharedLink(userId: number, fileId: number) {
    const file = await this.findOne(userId, fileId);
    console.log(file);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const sharedToken = this.jwtService.sign({
      userId: userId,
      fileId: fileId,
    });

    await this.sharedFileRepository.save({
      token: sharedToken,
      file: file,
      sharedWith: { id: userId },
    });

    return sharedToken;
  }

  async getFileIdBySharedToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      console.log(decodedToken)
      const sharedFile = await this.sharedFileRepository.findOne({
        select: ['file'], 
        where: { token: decodedToken.token },
        relations: ['file'], 
      });

      if (sharedFile && sharedFile.file) {
        return sharedFile.file.id;
      } else {
        return null; 
      }
    } catch (error) {
      return null; 
    }
  }

  private async logFileActivity(
    userId: number,
    fileId: number,
    action: string,
  ) {
    await this.activityLogRepository.save({
      user: { id: userId },
      file: { id: fileId },
      action,
    });
  }
}
