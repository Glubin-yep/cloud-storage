import { FileEntity } from 'src/files/entities/file.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatisticsEntity } from './user_statistics.entity';
import { SharedFileEntity } from 'src/files/entities/shared_files.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];

  @OneToMany(() => UserStatisticsEntity, (stats) => stats.user)
  statistics: UserStatisticsEntity[];

  @OneToMany(() => SharedFileEntity, (sharedFile) => sharedFile.sharedWith)
  sharedFiles: SharedFileEntity[];
}
