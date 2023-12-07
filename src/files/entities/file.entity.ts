import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { SharedFileEntity } from './shared_files.entity';
import { FileActivityLogEntity } from './fileActivityLogEntity';

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
