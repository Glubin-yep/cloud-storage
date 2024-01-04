import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { FileActivityLogEntity } from './file-activity-log.entity';
import { SharedFileEntity } from './shared-files.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @OneToMany(() => FileActivityLogEntity, (activityLog) => activityLog.file)
  fileActivityLogs: FileActivityLogEntity[];

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;

  @OneToMany(() => SharedFileEntity, (sharedFile) => sharedFile.file)
  sharedFiles: SharedFileEntity[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
