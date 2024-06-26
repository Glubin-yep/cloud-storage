import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { FileActivityLogEntity } from './file-activity-log.entity';
import { UserEntity } from '@/users/entities/user.entity';

@Entity('shared_files')
export class SharedFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FileEntity, (file) => file.sharedFiles)
  file: FileEntity;

  @CreateDateColumn()
  createdOn: Date;

  @Column()
  token: string;

  @OneToMany(
    () => FileActivityLogEntity,
    (activityLog) => activityLog.sharedFile,
  )
  fileActivityLogs: FileActivityLogEntity[];

  @ManyToOne(() => UserEntity, (user) => user.sharedFiles)
  sharedWith: UserEntity;
}
