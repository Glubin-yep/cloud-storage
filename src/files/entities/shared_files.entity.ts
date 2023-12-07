import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { FileEntity } from './file.entity';
import { FileActivityLogEntity } from './fileActivityLogEntity';

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
