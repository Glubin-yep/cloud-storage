import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_statistics')
export class UserStatisticsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  totalFiles: number;

  @Column({ default: 0 })
  uploadedFiles: number;

  @Column({ default: 0 })
  downloadedFiles: number;

  @ManyToOne(() => UserEntity, (user) => user.statistics)
  user: UserEntity;
}
