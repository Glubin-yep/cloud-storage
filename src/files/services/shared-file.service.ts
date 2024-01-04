import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { FileEntity } from '../entities/file.entity';
import { SharedFileEntity } from '../entities/shared-files.entity';

@Injectable()
export class SharedFileService {
  constructor(
    @InjectRepository(SharedFileEntity)
    private repository: Repository<SharedFileEntity>,
    private jwtService: JwtService,
  ) {}

  async createSharedLink(userId: number, file: FileEntity) {
    const sharedToken = this.jwtService.sign({
      userId: userId,
      fileId: file.id,
    });

    await this.repository.save({
      token: sharedToken,
      file: file,
      sharedWith: { id: userId },
    });

    return sharedToken;
  }

  async getFileIdBySharedToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);

      const sharedFile = await this.repository.findOne({
        select: ['file'],
        where: { token: decodedToken.token },
        relations: ['file'],
      });

      return sharedFile?.file?.id || null;
    } catch (error) {
      throw new NotFoundException('Invalid token');
    }
  }
}
