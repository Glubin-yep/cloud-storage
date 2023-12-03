import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { FileEntity } from './file.entity';

@Entity('shared_files')
export class SharedFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FileEntity, (file) => file.sharedFiles)
  file: FileEntity;

  @ManyToOne(() => UserEntity, (user) => user.sharedFiles)
  sharedWith: UserEntity;
}
