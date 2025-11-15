import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Job } from "./job.entity"; // Import Job entity

@Entity()
export class WorkEntry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ type: "int", default: 0 })
  breakDuration: number; // in minutes

  @ManyToOne(() => Job, (job) => job.id) // Many-to-one relationship with Job
  job: Job;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
