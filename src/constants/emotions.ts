export interface BasicEmotion {
  id: string;
  label: string;
  color: string;
}

export const BASIC_EMOTIONS: BasicEmotion[] = [
  { id: 'happiness', label: 'Happiness', color: '#F5C842' },
  { id: 'sadness',   label: 'Sadness',   color: '#5B7FD6' },
  { id: 'fear',      label: 'Fear',      color: '#4CAF7D' },
  { id: 'disgust',   label: 'Disgust',   color: '#9C6BBF' },
  { id: 'anger',     label: 'Anger',     color: '#EF5350' },
  { id: 'contempt',  label: 'Contempt',  color: '#B0A8B9' },
  { id: 'surprise',  label: 'Surprise',  color: '#29B6D6' },
];

export const BASIC_EMOTIONS_BY_ID = Object.fromEntries(BASIC_EMOTIONS.map(e => [e.id, e]));

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
      'The moment my mood shifted most today — what happened right before it?',
      'Something I did today that helped, even a little — what made it help?',
      'One thing I would do differently tomorrow:',
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
