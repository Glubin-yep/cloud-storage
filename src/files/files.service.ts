import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity, FileType } from './entities/file.entity';
import { Repository } from 'typeorm';
import { createReadStream } from 'fs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private usersService: UsersService, // Inject UsersService
  ) {}

  async create(file: Express.Multer.File, userId: number) {
    await this.usersService.updateUserStatistics(userId, 1, file.size / 1024, 1, 0);

    return this.repository.save({
      filename: file.filename,
      originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      size: file.size / 1024,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }
 
  async findAll(userId: number, fileType: FileType) {
    const qb = this.repository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType === FileType.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE :type', { type: '%image%' });
    }

    if (fileType === FileType.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return qb.getMany();
  }

  async getFileStream(userId: number, fileId: number) {
    const file = await this.findOne(userId, fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.usersService.updateUserStatistics(userId, 0, 0, 0, 1);
    const path = `uploads/${file.filename}`;
    const fileStream = createReadStream(path);

    return { fileStream, filename: file.originalName, fileType: file.mimetype };
  }

  async findOne(userId: number, fileId: number) {
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

    return qb.softDelete().execute();
  }
}
