import { EmotionColors, PrimaryEmotion } from './theme';

export interface PlutchikEmotion {
  id: string;
  label: string;
  primary: PrimaryEmotion;
  ring: 1 | 2 | 3; // 1=intense(inner), 2=primary(middle), 3=mild(outer)
  /** Center angle in degrees, 0=top, clockwise */
  angle: number;
  color: string;
}

// Each primary emotion sector spans 45°, centered at these angles:
// Joy=0°, Trust=45°, Fear=90°, Surprise=135°,
// Sadness=180°, Disgust=225°, Anger=270°, Anticipation=315°

const SECTOR_ANGLES: Record<PrimaryEmotion, number> = {
  joy:          0,
  trust:        45,
  fear:         90,
  surprise:     135,
  sadness:      180,
  disgust:      225,
  anger:        270,
  anticipation: 315,
};

function emotion(
  id: string,
  label: string,
  primary: PrimaryEmotion,
  ring: 1 | 2 | 3,
  colorOverride?: string,
): PlutchikEmotion {
  return {
    id,
    label,
    primary,
    ring,
    angle: SECTOR_ANGLES[primary],
    color: colorOverride ?? EmotionColors[primary],
  };
}

// Ring 1 = Intense (inner core)
// Ring 2 = Primary (middle)
// Ring 3 = Mild (outer)

export const EMOTIONS: PlutchikEmotion[] = [
  // ── JOY ──────────────────────────────────────────────────────────
  emotion('ecstasy',    'Ecstasy',    'joy',          1, '#FFD700'),
  emotion('joy',        'Joy',        'joy',          2, '#F5C842'),
  emotion('serenity',   'Serenity',   'joy',          3, '#FFF3A3'),

  // ── TRUST ─────────────────────────────────────────────────────────
  emotion('admiration', 'Admiration', 'trust',        1, '#5BA632'),
  emotion('trust',      'Trust',      'trust',        2, '#82C341'),
  emotion('acceptance', 'Acceptance', 'trust',        3, '#B8E08A'),

  // ── FEAR ──────────────────────────────────────────────────────────
  emotion('terror',       'Terror',       'fear',     1, '#1B7A4A'),
  emotion('fear',         'Fear',         'fear',     2, '#4CAF7D'),
  emotion('apprehension', 'Apprehension', 'fear',     3, '#A8D8BE'),

  // ── SURPRISE ──────────────────────────────────────────────────────
  emotion('amazement',   'Amazement',   'surprise',   1, '#0088B2'),
  emotion('surprise',    'Surprise',    'surprise',   2, '#29B6D6'),
  emotion('distraction', 'Distraction', 'surprise',   3, '#A3DFF0'),

  // ── SADNESS ───────────────────────────────────────────────────────
  emotion('grief',       'Grief',       'sadness',    1, '#2A4FA8'),
  emotion('sadness',     'Sadness',     'sadness',    2, '#5B7FD6'),
  emotion('pensiveness', 'Pensiveness', 'sadness',    3, '#AABEF0'),

  // ── DISGUST ───────────────────────────────────────────────────────
  emotion('loathing', 'Loathing', 'disgust',          1, '#6A3A9C'),
  emotion('disgust',  'Disgust',  'disgust',           2, '#9C6BBF'),
  emotion('boredom',  'Boredom',  'disgust',           3, '#C9A8E0'),

  // ── ANGER ─────────────────────────────────────────────────────────
  emotion('rage',       'Rage',       'anger',        1, '#C62828'),
  emotion('anger',      'Anger',      'anger',        2, '#EF5350'),
  emotion('annoyance',  'Annoyance',  'anger',        3, '#FFAAAA'),

  // ── ANTICIPATION ──────────────────────────────────────────────────
  emotion('vigilance',    'Vigilance',    'anticipation', 1, '#E65100'),
  emotion('anticipation', 'Anticipation', 'anticipation', 2, '#FF9800'),
  emotion('interest',     'Interest',     'anticipation', 3, '#FFD180'),
];

// Complex dyad emotions (adjacent primaries combined)
export interface DyadEmotion {
  id: string;
  label: string;
  primaries: [PrimaryEmotion, PrimaryEmotion];
  color: string;
  description: string;
}

export const DYAD_EMOTIONS: DyadEmotion[] = [
  { id: 'love',            label: 'Love',            primaries: ['joy', 'trust'],           color: '#FF6B6B', description: 'Joy + Trust' },
  { id: 'submission',      label: 'Submission',      primaries: ['trust', 'fear'],          color: '#6BCB77', description: 'Trust + Fear' },
  { id: 'awe',             label: 'Awe',             primaries: ['fear', 'surprise'],       color: '#4D96FF', description: 'Fear + Surprise' },
  { id: 'disapproval',     label: 'Disapproval',     primaries: ['surprise', 'sadness'],    color: '#845EC2', description: 'Surprise + Sadness' },
  { id: 'remorse',         label: 'Remorse',         primaries: ['sadness', 'disgust'],     color: '#4B4453', description: 'Sadness + Disgust' },
  { id: 'contempt',        label: 'Contempt',        primaries: ['disgust', 'anger'],       color: '#B0A8B9', description: 'Disgust + Anger' },
  { id: 'aggressiveness',  label: 'Aggressiveness',  primaries: ['anger', 'anticipation'],  color: '#FF9671', description: 'Anger + Anticipation' },
  { id: 'optimism',        label: 'Optimism',        primaries: ['anticipation', 'joy'],    color: '#FFD93D', description: 'Anticipation + Joy' },
];

export const ALL_EMOTIONS = EMOTIONS;

export const EMOTIONS_BY_RING = {
  1: EMOTIONS.filter(e => e.ring === 1),
  2: EMOTIONS.filter(e => e.ring === 2),
  3: EMOTIONS.filter(e => e.ring === 3),
};

export const EMOTIONS_BY_ID = Object.fromEntries(EMOTIONS.map(e => [e.id, e]));

export const PREDEFINED_CONTEXT_TAGS = [
  'morning', 'afternoon', 'evening', 'night',
  'at work', 'at home', 'commuting', 'outdoors',
  'with family', 'with friends', 'alone', 'in a crowd',
  'after news', 'social media', 'after argument',
  'before big event', 'tired', 'hungry', 'sick',
  'after exercise', 'poor sleep', 'good sleep',
] as const;

export const COPING_ACTIONS = [
  { id: 'breathing',   label: 'Deep breathing', emoji: '🌬️' },
  { id: 'journaling',  label: 'Journaling',     emoji: '📖' },
  { id: 'walk',        label: 'Walk/exercise',  emoji: '🚶' },
  { id: 'call',        label: 'Called someone', emoji: '📞' },
  { id: 'rest',        label: 'Rest/sleep',     emoji: '😴' },
  { id: 'music',       label: 'Music',          emoji: '🎵' },
  { id: 'meditation',  label: 'Meditation',     emoji: '🧘' },
  { id: 'water',       label: 'Drink water',    emoji: '💧' },
  { id: 'grounding',   label: '5-4-3-2-1',      emoji: '🌿' },
  { id: 'nothing',     label: 'Nothing yet',    emoji: '•' },
] as const;

export const BODY_REGIONS = [
  { id: 'head',      label: 'Head',      emoji: '🧠' },
  { id: 'throat',    label: 'Throat',    emoji: '🗣️' },
  { id: 'chest',     label: 'Chest',     emoji: '❤️' },
  { id: 'stomach',   label: 'Stomach',   emoji: '🫁' },
  { id: 'shoulders', label: 'Shoulders', emoji: '💪' },
  { id: 'arms',      label: 'Arms',      emoji: '🦾' },
  { id: 'legs',      label: 'Legs',      emoji: '🦵' },
  { id: 'hands',     label: 'Hands',     emoji: '🤲' },
] as const;

export const JOURNAL_TEMPLATES = [
  {
    id: 'free',
    label: 'Free Write',
    emoji: '✍️',
    description: 'Write whatever is on your mind',
    prompts: [''],
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    emoji: '🙏',
    description: 'Three things you are grateful for',
    prompts: [
      '1. I am grateful for...',
      '2. Something small that made me smile...',
      '3. A person I appreciate and why...',
    ],
  },
  {
    id: 'reflection',
    label: 'Daily Reflection',
    emoji: '🌅',
    description: 'End-of-day wind-down',
    prompts: [
      'What drained my energy today?',
      'What gave me energy today?',
      'What would I do differently tomorrow?',
    ],
  },
  {
    id: 'cbt',
    label: 'Thought Check',
    emoji: '🔍',
    description: 'Challenge an anxious thought (CBT)',
    prompts: [
      'The thought I keep having:',
      'Evidence that supports this thought:',
      'Evidence against this thought:',
      'A more balanced way to see this:',
    ],
  },
  {
    id: 'weekly-review',
    label: 'Weekly Review',
    emoji: '📅',
    description: 'Reflect on your week (best on Sundays)',
    prompts: [
      'What drained me this week?',
      'What energized me this week?',
      'A win I am proud of:',
      'One intention for next week:',
    ],
  },
  {
    id: 'future-self',
    label: 'Future Self',
    emoji: '💌',
    description: 'Write a letter to your future self',
    prompts: [
      'Dear future me,',
      'Right now I am feeling...',
      'Something I hope you remember:',
      'A message of encouragement:',
    ],
  },
] as const;
