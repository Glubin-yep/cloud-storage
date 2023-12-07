import { FileEntity } from 'src/files/entities/file.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatisticsEntity } from './user_statistics.entity';
import { SharedFileEntity } from 'src/files/entities/shared_files.entity';
import { FileActivityLogEntity } from 'src/files/entities/fileActivityLogEntity';
import { UserLoginEntity } from './user_logins.entity';

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

  @Column({ default: 0, type: 'int' })
  usedStorage: number;

  @Column({ default: 1_073_741_824, type: 'int' }) // 1GB
  maxStorage: number;

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];

  @OneToMany(() => UserStatisticsEntity, (stats) => stats.user)
  statistics: UserStatisticsEntity[];

  @OneToMany(() => SharedFileEntity, (sharedFile) => sharedFile.sharedWith)
  sharedFiles: SharedFileEntity[];

  @OneToMany(() => FileActivityLogEntity, (activityLog) => activityLog.user)
  fileActivityLogs: FileActivityLogEntity[];

  @OneToMany(() => UserLoginEntity, (login) => login.user)
  logins: UserLoginEntity[];
}
