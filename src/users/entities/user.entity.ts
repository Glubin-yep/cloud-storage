import { FileActivityLogEntity } from '@/files/entities/file-activity-log.entity';
import { FileEntity } from '@/files/entities/file.entity';
import { SharedFileEntity } from '@/files/entities/shared-files.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserLoginEntity } from './user-logins.entity';
import { UserStatisticsEntity } from './user-statistics.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  OAuthGithubId: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

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
