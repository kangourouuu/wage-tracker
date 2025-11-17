export interface Job {
  id: string;
  name: string;
  wagePerHour: number;
  userId: string;
}

export interface WorkEntry {
  id: string;
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  job: Job; // Link to Job
  details: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateWorkEntryDto {
  startTime: string;
  endTime: string;
  jobId: string; // Link to Job
  breakDuration?: number; // in minutes
}

export interface UpdateWorkEntryDto {
  startTime?: string;
  endTime?: string;
  jobId?: string;
  breakDuration?: number;
}
