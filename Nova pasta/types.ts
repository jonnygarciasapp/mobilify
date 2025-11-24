
export enum MuscleGroup {
  Ankle = "Ankle",
  Calf = "Calf",
  Hamstrings = "Hamstrings",
  Hips = "Hips",
  Thoracic = "Thoracic Spine",
  Shoulder = "Shoulder",
  Neck = "Neck",
  Wrists = "Wrists",
  LowerBack = "Lower Back",
  UpperBack = "Upper Back",
  Glutes = "Glutes",
  FullBody = "Full Body"
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  muscleGroup: MuscleGroup;
  defaultReps?: number;
  defaultDurationSeconds?: number;
  defaultSets: number;
  thumbnailUrl: string; // Placeholder for GIF
  type: 'reps' | 'time';
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  repsOrDuration: number; // Value for reps or seconds
  restSeconds: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  isPremium: boolean;
  createdAt: number;
}

// -- New Execution Types --

export interface WorkoutSetResult {
  setNumber: number;
  completed: boolean;
  repsOrDuration: number; // The actual value performed
  target: number; // The planned value
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSetResult[];
}

export interface WorkoutLog {
  id: string;
  routineId: string;
  routineName: string;
  startTime: number;
  endTime: number;
  totalDurationSeconds: number;
  exercises: WorkoutExerciseLog[]; // Detailed breakdown
}

export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  streakDays: number;
  lastWorkoutDate: number | null;
  isPremium: boolean;
}
