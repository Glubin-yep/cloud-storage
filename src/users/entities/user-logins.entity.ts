import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_logins')
export class UserLoginEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.logins)
  user: UserEntity;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ nullable: true })
  platform: string;

  @Column({ nullable: true })
  deviceType: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  loginTime: Date;
}
