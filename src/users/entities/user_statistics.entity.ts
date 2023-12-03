// Import necessary decorators and modules
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    DeleteDateColumn,
    Int32,
  } from 'typeorm';
import { UserEntity } from './user.entity';
  
  @Entity('user_statistics')
  export class UserStatisticsEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: 0 })
    totalFiles: number;
  
    @Column({ default: 0, type: 'int'})
    usedStorage: number;

    @Column({ default: 1_073_741_824, type: 'int'}) // 1GB
    maxStorage: number; 

    @Column({ default: 0 })
    uploadedFiles: number; 

    @Column({ default: 0 })
    downloadedFiles: number; 
  
    @ManyToOne(() => UserEntity, (user) => user.statistics)
    user: UserEntity;
  }