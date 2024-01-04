import { ActivityAction } from '@/enums/activity-action';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileActivityLogEntity } from '../entities/file-activity-log.entity';
@Injectable()
export class FileActivityService {
  constructor(
    @InjectRepository(FileActivityLogEntity)
    private repository: Repository<FileActivityLogEntity>,
  ) {}

  async logActivity(userId: number, fileId: number, action: ActivityAction) {
    await this.repository.save({
      user: { id: userId },
      file: { id: fileId },
      action,
    });
  }

  async getHistory(userId: number) {
    const activityLogs = await this.repository.find({
      where: { user: { id: userId } },
      relations: ['file'],
    });

    return activityLogs.map((log) => ({
      id: log.id,
      fileId: log.file?.id,
      fileName: log.file?.originalName,
      action: log.action,
      createdOn: log.createdOn,
    }));
  }
}
