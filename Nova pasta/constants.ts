
import { Exercise, MuscleGroup, Routine } from './types';

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'e1',
    name: 'Deep Squat Hold',
    muscleGroup: MuscleGroup.Hips,
    description: 'Improves hip mobility and ankle dorsiflexion.',
    detailedDescription: 'Sink into a deep squat, keeping heels flat on the ground. Keep chest up and use elbows to push knees out.',
    defaultSets: 3,
    defaultDurationSeconds: 45,
    type: 'time',
    thumbnailUrl: 'https://picsum.photos/id/73/400/400',
  },
  {
    id: 'e2',
    name: 'Cat-Cow Stretch',
    muscleGroup: MuscleGroup.Thoracic,
    description: 'Mobilizes the spine and relieves tension.',
    detailedDescription: 'Start on all fours. Inhale as you drop your belly (Cow), exhale as you arch your back (Cat).',
    defaultSets: 3,
    defaultReps: 10,
    type: 'reps',
    thumbnailUrl: 'https://picsum.photos/id/102/400/400',
  },
  {
    id: 'e3',
    name: '90/90 Hip Switch',
    muscleGroup: MuscleGroup.Hips,
    description: 'Internal and external rotation of the hips.',
    detailedDescription: 'Sit with legs at 90 degree angles. Rotate hips to switch leg positions without using hands if possible.',
    defaultSets: 3,
    defaultReps: 8,
    type: 'reps',
    thumbnailUrl: 'https://picsum.photos/id/160/400/400',
  },
  {
    id: 'e4',
    name: 'Doorway Pec Stretch',
    muscleGroup: MuscleGroup.Shoulder,
    description: 'Opens up the chest and shoulders.',
    detailedDescription: 'Place forearms on a doorframe at 90 degrees. Lean forward gently until a stretch is felt in the chest.',
    defaultSets: 2,
    defaultDurationSeconds: 30,
    type: 'time',
    thumbnailUrl: 'https://picsum.photos/id/211/400/400',
  },
  {
    id: 'e5',
    name: 'Ankle Dorsiflexion',
    muscleGroup: MuscleGroup.Ankle,
    description: 'Increases ankle range of motion.',
    detailedDescription: 'Kneel near a wall. Push knee forward over toe towards wall, keeping heel down.',
    defaultSets: 3,
    defaultDurationSeconds: 40,
    type: 'time',
    thumbnailUrl: 'https://picsum.photos/id/338/400/400',
  },
  {
    id: 'e6',
    name: 'World\'s Greatest Stretch',
    muscleGroup: MuscleGroup.FullBody,
    description: 'Targets hips, thoracic spine, and hamstrings.',
    detailedDescription: 'Lunge forward, place opposite hand on floor, and rotate top arm to ceiling.',
    defaultSets: 3,
    defaultReps: 5,
    type: 'reps',
    thumbnailUrl: 'https://picsum.photos/id/425/400/400',
  },
  {
    id: 'e7',
    name: 'Wrist Flexor Stretch',
    muscleGroup: MuscleGroup.Wrists,
    description: 'Relieves forearm tension.',
    detailedDescription: 'Extend arm with palm facing up. Pull fingers back gently with other hand.',
    defaultSets: 2,
    defaultDurationSeconds: 30,
    type: 'time',
    thumbnailUrl: 'https://picsum.photos/id/531/400/400',
  },
   {
    id: 'e8',
    name: 'Jefferson Curl',
    muscleGroup: MuscleGroup.Hamstrings,
    description: 'Strengthens and lengthens the posterior chain.',
    detailedDescription: 'Stand on a box. Slowly roll your spine down vertebrae by vertebrae, letting a light weight pull you down.',
    defaultSets: 3,
    defaultReps: 5,
    type: 'reps',
    thumbnailUrl: 'https://picsum.photos/id/619/400/400',
  }
];

export const PREMADE_ROUTINES: Routine[] = [
  {
    id: 'pm1',
    name: 'Daily Morning Mobility',
    isPremium: true,
    createdAt: Date.now(),
    exercises: [
      { exerciseId: 'e2', sets: 2, repsOrDuration: 10, restSeconds: 30 },
      { exerciseId: 'e1', sets: 2, repsOrDuration: 30, restSeconds: 30 },
      { exerciseId: 'e6', sets: 2, repsOrDuration: 5, restSeconds: 45 },
    ]
  },
  {
    id: 'pm2',
    name: 'Desk Worker Rescue',
    isPremium: true,
    createdAt: Date.now(),
    exercises: [
      { exerciseId: 'e4', sets: 3, repsOrDuration: 30, restSeconds: 30 },
      { exerciseId: 'e7', sets: 2, repsOrDuration: 30, restSeconds: 30 },
      { exerciseId: 'e2', sets: 3, repsOrDuration: 12, restSeconds: 30 },
      { exerciseId: 'e3', sets: 2, repsOrDuration: 8, restSeconds: 45 },
    ]
  }
];

export const INITIAL_STATS: import('./types').UserStats = {
  totalWorkouts: 0,
  totalMinutes: 0,
  streakDays: 0,
  lastWorkoutDate: null,
  isPremium: false,
};

// --- Localization Support ---

const EXERCISE_TRANSLATIONS = {
  pt: {
    e1: { 
      name: 'Agachamento Profundo Isométrico', 
      description: 'Melhora mobilidade de quadril e tornozelo.', 
      detailedDescription: 'Afunde em um agachamento profundo, mantendo os calcanhares no chão. Mantenha o peito erguido e use os cotovelos para empurrar os joelhos para fora.' 
    },
    e2: { 
      name: 'Postura Gato-Vaca', 
      description: 'Mobiliza a coluna e alivia tensão.', 
      detailedDescription: 'Comece em quatro apoios. Inspire ao deixar a barriga descer (Vaca), expire ao arquear as costas (Gato).' 
    },
    e3: { 
      name: 'Rotação de Quadril 90/90', 
      description: 'Rotação interna e externa dos quadris.', 
      detailedDescription: 'Sente-se com as pernas em ângulos de 90 graus. Gire os quadris para trocar a posição das pernas sem usar as mãos, se possível.' 
    },
    e4: { 
      name: 'Alongamento de Peitoral', 
      description: 'Abre o peito e ombros.', 
      detailedDescription: 'Coloque os antebraços no batente da porta a 90 graus. Incline-se para frente suavemente até sentir o alongamento no peito.' 
    },
    e5: { 
      name: 'Dorsiflexão de Tornozelo', 
      description: 'Aumenta a amplitude de movimento do tornozelo.', 
      detailedDescription: 'Ajoelhe-se perto de uma parede. Empurre o joelho para frente sobre o dedo do pé em direção à parede, mantendo o calcanhar no chão.' 
    },
    e6: { 
      name: 'O Maior Alongamento do Mundo', 
      description: 'Trabalha quadris, coluna torácica e posteriores.', 
      detailedDescription: 'Avance em afundo, coloque a mão oposta no chão e gire o braço de cima em direção ao teto.' 
    },
    e7: { 
      name: 'Alongamento Flexor de Punho', 
      description: 'Alivia tensão no antebraço.', 
      detailedDescription: 'Estenda o braço com a palma para cima. Puxe os dedos para trás suavemente com a outra mão.' 
    },
    e8: { 
      name: 'Jefferson Curl', 
      description: 'Fortalece e alonga a cadeia posterior.', 
      detailedDescription: 'Fique em cima de uma caixa. Enrole lentamente a coluna vértebra por vértebra, deixando um peso leve puxá-lo para baixo.' 
    }
  }
};

const PREMADE_TRANSLATIONS = {
  pt: {
    pm1: { name: 'Mobilidade Matinal Diária' },
    pm2: { name: 'Resgate do Trabalhador de Mesa' }
  }
};

export const getLocalizedExercises = (lang: string): Exercise[] => {
  if (lang !== 'pt') return EXERCISE_LIBRARY;
  return EXERCISE_LIBRARY.map(e => {
    const t = EXERCISE_TRANSLATIONS.pt[e.id as keyof typeof EXERCISE_TRANSLATIONS.pt];
    return t ? { ...e, ...t } : e;
  });
};

export const getLocalizedPremadeRoutines = (lang: string): Routine[] => {
  if (lang !== 'pt') return PREMADE_ROUTINES;
  return PREMADE_ROUTINES.map(r => {
    const t = PREMADE_TRANSLATIONS.pt[r.id as keyof typeof PREMADE_TRANSLATIONS.pt];
    return t ? { ...r, ...t } : r;
  });
};
