
import { Routine, WorkoutLog, UserStats } from '../types';
import { INITIAL_STATS } from '../constants';

const KEYS = {
  ROUTINES: 'mobilify_routines',
  LOGS: 'mobilify_logs',
  STATS: 'mobilify_stats',
};

export const getRoutines = (): Routine[] => {
  const stored = localStorage.getItem(KEYS.ROUTINES);
  return stored ? JSON.parse(stored) : [];
};

export const saveRoutine = (routine: Routine): void => {
  const routines = getRoutines();
  routines.push(routine);
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
};

export const getLogs = (): WorkoutLog[] => {
  const stored = localStorage.getItem(KEYS.LOGS);
  return stored ? JSON.parse(stored) : [];
};

export const saveLog = (log: WorkoutLog): void => {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  
  // Update stats
  const stats = getStats();
  stats.totalWorkouts += 1;
  stats.totalMinutes += Math.round(log.totalDurationSeconds / 60);
  stats.lastWorkoutDate = Date.now();
  
  // Simple streak logic (check if last workout was yesterday or today)
  // For demo, we just increment. A real app would check dates.
  stats.streakDays = stats.streakDays + 1; 

  saveStats(stats);
};

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(KEYS.STATS);
  return stored ? JSON.parse(stored) : INITIAL_STATS;
};

export const saveStats = (stats: UserStats): void => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};

export const seedDatabase = () => {
    // Only used to ensure premade logic is available in specific contexts
};
