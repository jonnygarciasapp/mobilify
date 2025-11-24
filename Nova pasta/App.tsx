
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  User, 
  Plus, 
  Play, 
  ChevronRight, 
  Trophy, 
  Flame, 
  Lock,
  CheckCircle,
  X,
  ChevronLeft,
  Clock,
  Minus,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

import { 
  Exercise, 
  Routine, 
  RoutineExercise, 
  MuscleGroup, 
  UserStats, 
  WorkoutLog,
  WorkoutSetResult,
  WorkoutExerciseLog
} from './types';
import { INITIAL_STATS, getLocalizedExercises, getLocalizedPremadeRoutines } from './constants';
import * as Storage from './services/storageService';
import * as Gemini from './services/geminiService';
import { getSystemLanguage, STRINGS } from './services/localization';

// --- Language Context ---

const LanguageContext = React.createContext<{ 
  lang: 'en' | 'pt'; 
  t: typeof STRINGS['en'];
  library: Exercise[];
  premade: Routine[];
}>(null!);

// --- Shared Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  fullWidth = false 
}: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 disabled:bg-brand-300",
    secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:bg-slate-100 disabled:text-slate-400",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-500 bg-white",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, action }: any) => (
  <div className="flex justify-between items-end mb-4 px-1">
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    {action}
  </div>
);

const Chip = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
      active ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'bg-white text-slate-500 border border-slate-200'
    }`}
  >
    {label}
  </button>
);

// --- Pages ---

// 1. Home Page
const HomePage = ({ stats }: { stats: UserStats }) => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [aiTip, setAiTip] = useState<string>("...");
  const navigate = useNavigate();
  const { t, lang } = useContext(LanguageContext);

  useEffect(() => {
    setLogs(Storage.getLogs().reverse().slice(0, 5));
    setAiTip(t.loading);
    Gemini.getAITip("recovery and mobility", lang).then(setAiTip);
  }, [lang, t.loading]);

  const weeklyData = useMemo(() => {
    // Mock data based on logs for visual demo
    return [
      { name: 'S', min: 10 }, { name: 'T', min: 25 }, { name: 'Q', min: 0 }, 
      { name: 'Q', min: 30 }, { name: 'S', min: 15 }, { name: 'S', min: 45 }, { name: 'D', min: 20 }
    ];
  }, [logs]);

  const dateStr = new Date().toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="pb-24 pt-6 px-4 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.goodMorning}</h1>
          <p className="text-slate-500 text-sm capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-bold border border-orange-100">
          <Flame size={16} />
          <span>{stats.streakDays}</span>
        </div>
      </div>

      {/* AI Tip */}
      <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
             <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{t.coachTip}</h3>
            <p className="text-brand-50 text-sm leading-relaxed opacity-90">{aiTip}</p>
          </div>
        </div>
      </Card>

      {/* Weekly Chart */}
      <div>
        <SectionHeader title={t.weeklyVolume} />
        <Card className="h-48 flex items-end pb-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="min" fill="#10b981" radius={[4, 4, 4, 4]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionHeader title={t.recentActivity} />
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              {t.noWorkouts}
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{log.routineName}</h4>
                    <p className="text-xs text-slate-500">
                      {Math.floor(log.totalDurationSeconds / 60)} {t.min} • {new Date(log.endTime).toLocaleDateString(lang === 'pt' ? 'pt-BR' : undefined)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">{t.done}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Button fullWidth onClick={() => navigate('/training')}>
        {t.startWorkout}
      </Button>
    </div>
  );
};

// 2. Training Page
const TrainingPage = ({ stats }: { stats: UserStats }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const navigate = useNavigate();
  const { t, premade } = useContext(LanguageContext);
  const isPremium = stats.isPremium;

  useEffect(() => {
    setRoutines(Storage.getRoutines());
  }, []);

  const handleStart = (routine: Routine) => {
    if (routine.isPremium && !isPremium) {
      alert(t.premiumOnly);
      return;
    }
    navigate('/session', { state: { routine } });
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 animate-fade-in">
       <SectionHeader 
         title={t.myRoutines} 
         action={
           <button 
             onClick={() => navigate('/create')}
             className="text-brand-600 font-semibold text-sm flex items-center gap-1 hover:text-brand-700"
           >
             <Plus size={16} /> {t.create}
           </button>
         } 
       />

       <div className="grid gap-4">
          {routines.map(routine => (
            <Card key={routine.id} className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{routine.name}</h3>
                  <p className="text-slate-500 text-sm">{routine.exercises.length} {t.exercises}</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth onClick={() => handleStart(routine)}>
                {t.startRoutine}
              </Button>
            </Card>
          ))}
          {routines.length < (isPremium ? 99 : 3) && (
             <button 
               onClick={() => navigate('/create')}
               className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-500 transition-colors gap-2"
             >
               <Plus size={24} />
               <span className="font-medium">{t.createNewRoutine}</span>
             </button>
          )}
       </div>

       <SectionHeader title={t.explore} />
       <div className="grid gap-4">
          {premade.map(routine => (
            <div key={routine.id} className="relative group">
              <Card className="flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-900">{routine.name}</h3>
                        {routine.isPremium && <Lock size={14} className="text-amber-500" />}
                     </div>
                    <p className="text-slate-500 text-sm">{t.scientific} • {routine.exercises.length} {t.exercises}</p>
                  </div>
                </div>
                <Button 
                  variant={isPremium ? "secondary" : "ghost"} 
                  fullWidth 
                  onClick={() => handleStart(routine)}
                  disabled={!isPremium && routine.isPremium}
                >
                  {isPremium ? t.startRoutine : t.premiumOnly}
                </Button>
              </Card>
              {!isPremium && routine.isPremium && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-2xl z-10 pointer-events-none" />
              )}
            </div>
          ))}
       </div>
    </div>
  );
};

// 3. Create Routine Page
const CreateRoutinePage = () => {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [filter, setFilter] = useState<MuscleGroup | 'All'>('All');
  const navigate = useNavigate();
  const { t, library } = useContext(LanguageContext);

  const handleAdd = (ex: Exercise) => {
    setSelectedExercises(prev => [...prev, {
      exerciseId: ex.id,
      sets: ex.defaultSets,
      repsOrDuration: ex.type === 'time' ? (ex.defaultDurationSeconds || 30) : (ex.defaultReps || 10),
      restSeconds: 30
    }]);
  };

  const handleSave = () => {
    if (!name || selectedExercises.length === 0) return;
    const newRoutine: Routine = {
      id: Date.now().toString(),
      name,
      exercises: selectedExercises,
      isPremium: false,
      createdAt: Date.now()
    };
    Storage.saveRoutine(newRoutine);
    navigate('/training');
  };

  const filteredLibrary = filter === 'All' 
    ? library 
    : library.filter(e => e.muscleGroup === filter);

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="sticky top-0 bg-white z-10 border-b border-slate-100 p-4 pt-12 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600"><X /></button>
        <h1 className="font-bold text-lg">{t.newRoutine}</h1>
        <button onClick={handleSave} className="text-brand-600 font-bold disabled:opacity-50" disabled={!name || selectedExercises.length === 0}>{t.save}</button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.routineName}</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.placeholderRoutineName}
            className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500 outline-none text-lg font-medium placeholder:text-slate-400"
          />
        </div>

        <div>
           <SectionHeader title={t.exercises} />
           {selectedExercises.length > 0 && (
             <div className="mb-6 space-y-2">
               {selectedExercises.map((re, idx) => {
                 const ex = library.find(e => e.id === re.exerciseId);
                 return (
                   <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                     <span className="font-medium text-slate-700">{ex?.name}</span>
                     <span className="text-slate-500">{re.sets} x {re.repsOrDuration} {ex?.type === 'time' ? 's' : 'reps'}</span>
                   </div>
                 );
               })}
             </div>
           )}

           <div className="flex overflow-x-auto gap-2 mb-4 pb-2 no-scrollbar">
             <Chip label="All" active={filter === 'All'} onClick={() => setFilter('All')} />
             {Object.values(MuscleGroup).map(g => (
               <Chip key={g} label={t.muscleGroups[g as keyof typeof t.muscleGroups] || g} active={filter === g} onClick={() => setFilter(g)} />
             ))}
           </div>

           <div className="grid gap-3">
             {filteredLibrary.map(ex => (
               <div key={ex.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-brand-200 transition-colors bg-white">
                 <img src={ex.thumbnailUrl} alt={ex.name} className="w-14 h-14 rounded-lg object-cover bg-slate-100" />
                 <div className="flex-1">
                   <h4 className="font-semibold text-slate-800 text-sm">{ex.name}</h4>
                   <p className="text-xs text-slate-500">{t.muscleGroups[ex.muscleGroup as keyof typeof t.muscleGroups] || ex.muscleGroup}</p>
                 </div>
                 <button 
                   onClick={() => handleAdd(ex)}
                   className="w-8 h-8 flex items-center justify-center bg-brand-50 text-brand-600 rounded-full hover:bg-brand-500 hover:text-white transition-all"
                 >
                   <Plus size={18} />
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// 4. Session Page (Complex Execution)
const SessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, library } = useContext(LanguageContext);
  
  const routine = location.state?.routine as Routine;
  
  // -- State --
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [workoutData, setWorkoutData] = useState<WorkoutExerciseLog[]>([]);
  const [currentSets, setCurrentSets] = useState<WorkoutSetResult[]>([]);
  
  // Timer Overlay State
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Initialize data if routine missing
  useEffect(() => {
    if (!routine) {
      navigate('/training');
      return;
    }
  }, [routine, navigate]);

  // Load sets for current exercise
  useEffect(() => {
    if (routine && routine.exercises[exerciseIndex]) {
      const routineEx = routine.exercises[exerciseIndex];
      // Create initial sets based on routine plan
      const initialSets: WorkoutSetResult[] = Array.from({ length: routineEx.sets }).map((_, i) => ({
        setNumber: i + 1,
        completed: false,
        repsOrDuration: routineEx.repsOrDuration,
        target: routineEx.repsOrDuration
      }));
      setCurrentSets(initialSets);
    }
  }, [exerciseIndex, routine]);

  // Timer Tick
  useEffect(() => {
    let interval: any;
    if (showRestTimer && restTime > 0) {
      interval = setInterval(() => setRestTime(t => t - 1), 1000);
    } else if (restTime === 0 && showRestTimer) {
       // Timer finished, optional beep here
    }
    return () => clearInterval(interval);
  }, [showRestTimer, restTime]);

  // -- Handlers --

  const handleToggleSet = (index: number) => {
    const newSets = [...currentSets];
    newSets[index].completed = !newSets[index].completed;
    setCurrentSets(newSets);
    
    // If completing a set, trigger rest
    if (newSets[index].completed) {
      const routineEx = routine.exercises[exerciseIndex];
      if (routineEx.restSeconds > 0) {
        setRestTime(routineEx.restSeconds);
        setShowRestTimer(true);
      }
    }
  };

  const handleUpdateValue = (index: number, delta: number) => {
    const newSets = [...currentSets];
    newSets[index].repsOrDuration = Math.max(0, newSets[index].repsOrDuration + delta);
    setCurrentSets(newSets);
  };

  const handleAddSet = () => {
    const lastSet = currentSets[currentSets.length - 1];
    setCurrentSets([...currentSets, {
      setNumber: currentSets.length + 1,
      completed: false,
      repsOrDuration: lastSet ? lastSet.repsOrDuration : 10,
      target: lastSet ? lastSet.target : 10
    }]);
  };

  const handleRemoveSet = () => {
    if (currentSets.length > 1) {
      setCurrentSets(currentSets.slice(0, -1));
    }
  };

  const saveCurrentExerciseData = () => {
    const routineEx = routine.exercises[exerciseIndex];
    const exercise = library.find(e => e.id === routineEx.exerciseId);
    
    const exerciseLog: WorkoutExerciseLog = {
      exerciseId: routineEx.exerciseId,
      exerciseName: exercise?.name || "Unknown",
      sets: currentSets
    };

    // Update or Append to workoutData
    const newData = [...workoutData];
    // Check if we already have data for this index (in case user went back)
    if (newData[exerciseIndex]) {
      newData[exerciseIndex] = exerciseLog;
    } else {
      newData.push(exerciseLog);
    }
    setWorkoutData(newData);
  };

  const handleNextExercise = () => {
    saveCurrentExerciseData();
    if (exerciseIndex < routine.exercises.length - 1) {
      setExerciseIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevExercise = () => {
    saveCurrentExerciseData();
    if (exerciseIndex > 0) {
      setExerciseIndex(prev => prev - 1);
    }
  };

  const handleFinishWorkout = () => {
    const endTime = Date.now();
    
    // Ensure last exercise is saved if we are on it
    let finalData = [...workoutData];
    if (!workoutData[exerciseIndex]) {
       const routineEx = routine.exercises[exerciseIndex];
       const exercise = library.find(e => e.id === routineEx.exerciseId);
       finalData.push({
         exerciseId: routineEx.exerciseId,
         exerciseName: exercise?.name || "Unknown",
         sets: currentSets
       });
    }

    const log: WorkoutLog = {
      id: Date.now().toString(),
      routineId: routine.id,
      routineName: routine.name,
      startTime,
      endTime,
      totalDurationSeconds: (endTime - startTime) / 1000,
      exercises: finalData
    };

    Storage.saveLog(log);
    navigate('/');
  };

  if (!routine) return null;

  const routineEx = routine.exercises[exerciseIndex];
  const exercise = library.find(e => e.id === routineEx.exerciseId);

  return (
    <div className="bg-white min-h-screen flex flex-col relative">
      
      {/* Rest Timer Overlay */}
      {showRestTimer && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 animate-fade-in">
          <div className="mb-8 p-6 rounded-full bg-white/10">
            <Clock size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-2">{t.rest}</h2>
          <div className="text-7xl font-mono font-bold mb-8">{restTime}s</div>
          <div className="flex gap-4 w-full">
            <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white" onClick={() => setRestTime(t => t + 10)}>+10s</Button>
            <Button className="flex-1 bg-brand-500 hover:bg-brand-600 border-none text-white" onClick={() => setShowRestTimer(false)}>{t.skip}</Button>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col p-6 animate-fade-in">
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Trophy size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">{t.goodJob}</h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-slate-500 text-sm uppercase font-bold">{t.totalTime}</p>
                    <p className="text-2xl font-bold text-slate-800">{Math.floor((Date.now() - startTime) / 60000)}m</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-slate-500 text-sm uppercase font-bold">{t.exercisesCompleted}</p>
                    <p className="text-2xl font-bold text-slate-800">{workoutData.length + 1}</p>
                 </div>
              </div>
           </div>
           <div className="space-y-3">
             <Button fullWidth onClick={handleFinishWorkout}>{t.finish}</Button>
             <Button fullWidth variant="ghost" onClick={() => setShowSummary(false)}>{t.cancel}</Button>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-12 pb-2 px-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
         <button onClick={() => navigate('/training')} className="p-2 text-slate-400"><X /></button>
         <div className="font-bold text-slate-800">
            {exerciseIndex + 1} / {routine.exercises.length}
         </div>
         <button onClick={() => setShowSummary(true)} className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-bold rounded-lg">{t.finish}</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Exercise Info */}
        <div className="p-4 flex flex-col items-center">
           <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-4 shadow-inner relative">
              <img src={exercise?.thumbnailUrl} className="w-full h-full object-cover" alt="Exercise" />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                GIF
              </div>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">{exercise?.name}</h1>
           <p className="text-slate-500 text-center text-sm">{exercise?.type === 'time' ? t.time : t.reps} • {t.muscleGroups[exercise?.muscleGroup as keyof typeof t.muscleGroups] || exercise?.muscleGroup}</p>
        </div>

        {/* Sets Tracker Table */}
        <div className="px-4">
           <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase mb-2 px-4">
              <span className="w-12 text-center">{t.set}</span>
              <span className="w-24 text-center">{exercise?.type === 'time' ? 'Sec' : t.reps}</span>
              <span className="w-20 text-center">{t.previous}</span>
              <span className="w-10 text-center"></span>
           </div>

           <div className="space-y-2">
             {currentSets.map((set, idx) => (
               <div key={idx} className={`flex justify-between items-center p-2 rounded-xl border transition-all ${set.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}>
                  <span className="w-12 text-center font-bold text-slate-600">{set.setNumber}</span>
                  
                  {/* Editable Value */}
                  <div className="w-24 flex items-center justify-center gap-2">
                     {!set.completed && (
                       <button onClick={() => handleUpdateValue(idx, -1)} className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600"><Minus size={12}/></button>
                     )}
                     <span className={`font-bold text-lg ${set.completed ? 'text-green-700' : 'text-slate-800'}`}>{set.repsOrDuration}</span>
                     {!set.completed && (
                       <button onClick={() => handleUpdateValue(idx, 1)} className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600"><Plus size={12}/></button>
                     )}
                  </div>

                  <span className="w-20 text-center text-slate-400 text-sm">-</span>

                  {/* Checkbox */}
                  <div className="w-10 flex justify-end">
                     <button 
                       onClick={() => handleToggleSet(idx)}
                       className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                     >
                       <Check strokeWidth={3} size={20} />
                     </button>
                  </div>
               </div>
             ))}
           </div>
           
           <div className="flex justify-center gap-3 mt-4">
             <button onClick={handleAddSet} className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-100 flex items-center gap-2">
               <Plus size={16} /> {t.addSet}
             </button>
             {currentSets.length > 1 && (
               <button onClick={handleRemoveSet} className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-100">
                 {t.removeSet}
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3">
         <Button 
           variant="secondary" 
           onClick={handlePrevExercise} 
           disabled={exerciseIndex === 0}
           className="px-4"
         >
           <ChevronLeft />
         </Button>
         <Button fullWidth onClick={handleNextExercise}>
           {exerciseIndex === routine.exercises.length - 1 ? t.finish : t.complete}
         </Button>
      </div>
    </div>
  );
};

// 5. Profile Page
const ProfilePage = ({ stats, setStats }: { stats: UserStats, setStats: any }) => {
  const { t } = useContext(LanguageContext);

  const togglePremium = () => {
    const newStats = { ...stats, isPremium: !stats.isPremium };
    Storage.saveStats(newStats);
    setStats(newStats);
  };

  const data = [
    { name: 'Jan', workouts: 12 },
    { name: 'Feb', workouts: 19 },
    { name: 'Mar', workouts: 3 },
    { name: 'Apr', workouts: 5 },
    { name: 'May', workouts: 2 },
    { name: 'Jun', workouts: stats.totalWorkouts || 1 },
  ];

  return (
    <div className="pb-24 pt-6 px-4 space-y-8 animate-fade-in">
      <SectionHeader title={t.profile} />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-3xl">🧘</div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">User</h2>
          <p className={`text-sm font-medium ${stats.isPremium ? 'text-brand-500' : 'text-slate-500'}`}>
            {stats.isPremium ? t.premiumMember : t.freeAccount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center py-6">
           <span className="text-3xl font-bold text-slate-900 mb-1">{stats.totalWorkouts}</span>
           <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t.workouts}</span>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6">
           <span className="text-3xl font-bold text-slate-900 mb-1">{stats.totalMinutes}</span>
           <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t.minutes}</span>
        </Card>
      </div>

      <div>
        <SectionHeader title={t.consistency} />
        <Card className="h-64">
           {stats.isPremium ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="workouts" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill:'#10b981', strokeWidth:0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <div className="p-3 bg-slate-50 rounded-full text-slate-400"><Lock /></div>
               <div>
                 <p className="font-bold text-slate-900">{t.premiumStats}</p>
                 <p className="text-sm text-slate-500 max-w-[200px]">{t.unlockStats}</p>
               </div>
             </div>
           )}
        </Card>
      </div>

      <Card className="bg-slate-900 text-white border-none relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">Mobilify Premium</h3>
          <p className="text-slate-400 text-sm mb-6">{t.premiumBenefits}</p>
          <Button onClick={togglePremium} variant="primary" className="bg-white text-slate-900 hover:bg-slate-100 shadow-none border-none">
            {stats.isPremium ? t.manageSubscription : t.upgrade}
          </Button>
        </div>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
      </Card>
      
      {/* Dev helper */}
      <div className="text-center">
         <button onClick={togglePremium} className="text-xs text-slate-300 underline">
            {t.devToggle}
         </button>
      </div>
    </div>
  );
};

// --- Layout & Navigation ---

const Navigation = () => {
  const { t } = useContext(LanguageContext);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 pb-8 flex justify-between items-center z-40">
      <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Home size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold">{t.home}</span>
      </NavLink>
      <NavLink to="/training" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Dumbbell size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold">{t.training}</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <User size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold">{t.profile}</span>
      </NavLink>
    </nav>
  );
};

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl overflow-hidden relative">
      {children}
      <Navigation />
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  useEffect(() => {
    // Load initial stats
    setStats(Storage.getStats());
  }, []);

  const lang = useMemo(() => getSystemLanguage(), []);
  const t = STRINGS[lang];
  const library = useMemo(() => getLocalizedExercises(lang), [lang]);
  const premade = useMemo(() => getLocalizedPremadeRoutines(lang), [lang]);

  return (
    <HashRouter>
      <LanguageContext.Provider value={{ lang, t, library, premade }}>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage stats={stats} /></MainLayout>} />
          <Route path="/training" element={<MainLayout><TrainingPage stats={stats} /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage stats={stats} setStats={setStats} /></MainLayout>} />
          <Route path="/create" element={<MainLayout><CreateRoutinePage /></MainLayout>} />
          <Route path="/session" element={<SessionPage />} />
        </Routes>
      </LanguageContext.Provider>
    </HashRouter>
  );
}
