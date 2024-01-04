import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { SharedFileEntity } from './shared-files.entity';

@Entity('file_activity_log')
export class FileActivityLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.fileActivityLogs)
  user: UserEntity;

  @ManyToOne(() => FileEntity, (file) => file.fileActivityLogs)
  file: FileEntity;

  @ManyToOne(
    () => SharedFileEntity,
    (sharedFile) => sharedFile.fileActivityLogs,
  )
  sharedFile: SharedFileEntity;

  @Column()
  action: string;

  @CreateDateColumn()
  createdOn: Date;
}
