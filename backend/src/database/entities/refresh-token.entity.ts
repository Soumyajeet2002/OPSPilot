import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { User } from '../../users/entities/user.entity.js';
  
  @Entity('refresh_tokens')
  @Index('IDX_refresh_tokens_hash', ['tokenHash'], { unique: true })
  @Index('IDX_refresh_tokens_user_id', ['userId'])
  export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ name: 'token_hash', type: 'varchar', length: 64 })
    tokenHash: string;
  
    @Column({ name: 'remember_me', type: 'boolean', default: false })
    rememberMe: boolean;
  
    @Column({ name: 'expires_at', type: 'timestamptz' })
    expiresAt: Date;
  
    @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
    revokedAt: Date | null;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  }