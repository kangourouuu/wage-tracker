import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { WorkEntry } from "../../wage/entities/work-entry.entity";
import { Job } from "../../wage/entities/job.entity"; // Import Job entity

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @OneToMany(() => WorkEntry, (workEntry) => workEntry.user)
  workEntries: WorkEntry[];

  @OneToMany(() => Job, (job) => job.user) // Add OneToMany relationship for Job
  jobs: Job[];

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
