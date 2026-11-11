import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    SUSPENDED = 'SUSPENDED',
  }
  
  @Entity('users')
  @Index('IDX_users_email', ['email'], { unique: true })
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    email: string;
  
    @Column({ name: 'password_hash', type: 'varchar', select: false })
    passwordHash: string;
  
    @Column({ name: 'first_name', type: 'varchar', length: 100 })
    firstName: string;
  
    @Column({ name: 'last_name', type: 'varchar', length: 100 })
    lastName: string;
  
    @Column({
      type: 'enum',
      enum: UserStatus,
      enumName: 'users_status_enum',
      default: UserStatus.ACTIVE,
    })
    status: UserStatus;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }