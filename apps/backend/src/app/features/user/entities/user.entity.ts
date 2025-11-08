
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkEntry } from '../../wage/entities/work-entry.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wagePerHour: number;

  @OneToMany(() => WorkEntry, (workEntry) => workEntry.user)
  workEntries: WorkEntry[];

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
