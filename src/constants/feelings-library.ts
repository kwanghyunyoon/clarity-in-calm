import { EmotionColors } from './theme';

export interface FeelingsLibraryEntry {
  id: string;
  label: string;
  emoji: string;
  color: string;
  notice: string;
  hear: string;
  feel: string;
  ease: string;
  explore: string[];
}

export const FEELINGS_LIBRARY: FeelingsLibraryEntry[] = [
  {
    id: 'anger',
    label: 'Anger',
    emoji: '🔥',
    color: EmotionColors.anger,
    notice: 'A short fuse, a clenched jaw, snapping at things that wouldn\'t normally bother you. It often arrives fast and wants to be acted on immediately.',
    hear: 'Anger usually says "this isn\'t fair" or "I have to fix this right now." It\'s protecting a boundary that got crossed, even if the target of your anger isn\'t the real cause.',
    feel: 'Heat in the chest and face, tight fists or jaw, a racing pulse, an urge to move or speak sharply.',
    ease: 'You\'re allowed to be angry without acting on every impulse it hands you. Give it a body first — a walk, a few hard exhales — before you give it words.',
    explore: [
      'What boundary feels crossed right now — and is it really this moment, or something older?',
      'If you said the honest version of what you\'re thinking, what would it be?',
      'What would "handled" actually look like a day from now?',
    ],
  },
  {
    id: 'anxiousness',
    label: 'Anxiousness',
    emoji: '🌪️',
    color: '#E0A030',
    notice: 'Racing thoughts that jump between worst-case scenarios, restlessness, checking things over and over, trouble settling on one task.',
    hear: 'Anxiousness tends to say "what if" on a loop. It\'s trying to prepare you for danger by rehearsing every version of it in advance.',
    feel: 'A fluttering or tight stomach, shallow breathing, a jittery or wired feeling in the limbs.',
    ease: 'You don\'t have to solve every "what if" tonight. Naming one thing you can control right now is usually enough to loosen the loop.',
    explore: [
      'Which part of this worry is actually within your control today?',
      'What\'s the story your mind is telling, and what evidence actually supports it?',
      'What has helped you get through uncertainty before?',
    ],
  },
  {
    id: 'burnout',
    label: 'Burnout',
    emoji: '🕯️',
    color: '#B0785C',
    notice: 'Flatness where drive used to be, dragging through tasks you normally handle easily, a sense that even rest doesn\'t refill you.',
    hear: 'Burnout says "I should be able to keep going" long after the tank is empty. It mistakes exhaustion for a character flaw instead of a signal.',
    feel: 'Heaviness in the limbs, foggy thinking, a dull ache behind the eyes, low motivation even for things you enjoy.',
    ease: 'Rest isn\'t something you earn after finishing everything — it\'s what makes finishing anything possible. One thing can wait.',
    explore: [
      'What has quietly been non-negotiable that could actually be renegotiated?',
      'When did you last feel like yourself, and what was different that day?',
      'If you gave yourself permission to do less this week, what would you drop first?',
    ],
  },
  {
    id: 'fear',
    label: 'Fear',
    emoji: '🫧',
    color: EmotionColors.fear,
    notice: 'A sudden alertness, wanting to avoid or escape a specific situation, a mind that keeps circling back to the threat.',
    hear: 'Fear says "this could hurt me" and narrows your focus to the danger. It\'s an old, fast system trying to keep you safe, even when the threat is more uncertain than physical.',
    feel: 'A jolt in the chest, cold hands, a held breath, muscles ready to move.',
    ease: 'Naming the fear out loud, even just to yourself, takes some of its power away. Ask what\'s actually happening right now, in this room, versus what your mind is predicting.',
    explore: [
      'What specifically are you afraid will happen, in concrete terms?',
      'Has this fear been right before, or does it tend to overestimate the danger?',
      'What\'s one small step toward the thing you\'re avoiding?',
    ],
  },
  {
    id: 'sadness',
    label: 'Sadness',
    emoji: '🌧️',
    color: EmotionColors.sadness,
    notice: 'Low energy, tearfulness, wanting to withdraw or go quiet, things that used to feel light now feeling heavy.',
    hear: 'Sadness says "something mattered and it\'s gone, or going." It\'s the natural response to loss, even loss that\'s hard to name.',
    feel: 'A heaviness in the chest, a lump in the throat, tired eyes, a slower body.',
    ease: 'Sadness doesn\'t need to be fixed right away — it needs room. Let yourself feel it for a few minutes without rushing to feel better.',
    explore: [
      'What, specifically, feels like it\'s been lost?',
      'Who or what would help just by being nearby right now?',
      'What would comfort — not distraction — look like today?',
    ],
  },
  {
    id: 'insecurity',
    label: 'Insecurity',
    emoji: '🪞',
    color: '#8C7AA8',
    notice: 'Second-guessing your choices, comparing yourself to others, a voice that finds fault before anyone else does.',
    hear: 'Insecurity says "you\'re not enough" or "they\'ll find out." It\'s often an old fear of not belonging, wearing the costume of self-criticism.',
    feel: 'A sinking feeling in the stomach, shrinking posture, warmth in the face (shame\'s close cousin).',
    ease: 'The voice doubting you is not a neutral judge — it\'s a scared, old habit of thinking. You\'re allowed to disagree with it.',
    explore: [
      'Whose voice does this criticism actually sound like?',
      'What would you say to a friend who felt exactly this way?',
      'What\'s one piece of real evidence that contradicts the doubt?',
    ],
  },
  {
    id: 'loneliness',
    label: 'Loneliness',
    emoji: '🌙',
    color: '#5C7A9C',
    notice: 'A quiet ache even around other people, a pull to isolate further, a sense of being unseen or unreachable.',
    hear: 'Loneliness says "no one really gets it" or "I\'m on my own here." It\'s a signal that connection is missing, not proof that it\'s unavailable.',
    feel: 'A hollow feeling in the chest, low energy, a heaviness that settles in quiet moments.',
    ease: 'Loneliness shrinks with even small, real contact — a text, a call, sitting somewhere with other people around. It doesn\'t need to be solved all at once.',
    explore: [
      'Who is one person you could reach out to today, even briefly?',
      'When did you last feel truly understood, and what made that possible?',
      'Is this loneliness about being alone, or about feeling unseen?',
    ],
  },
  {
    id: 'overwhelm',
    label: 'Overwhelm',
    emoji: '🌊',
    color: '#3C8C9C',
    notice: 'Too many things pulling at once, difficulty deciding where to start, a foggy or frozen feeling instead of clear thinking.',
    hear: 'Overwhelm says "there\'s too much and not enough of me." It\'s not that you can\'t handle things — it\'s that too many things are asking for attention at the same time.',
    feel: 'A tight chest, shallow breathing, a buzzing or scattered feeling in the head, restlessness or freezing.',
    ease: 'You don\'t have to hold everything at once. Pick the single smallest next step and let the rest wait its turn.',
    explore: [
      'If you could only do one thing today, what would actually matter most?',
      'What\'s something on your plate that could be delayed, dropped, or handed off?',
      'What would it feel like to do this imperfectly instead of not at all?',
    ],
  },
];

export const FEELINGS_LIBRARY_BY_ID: Record<string, FeelingsLibraryEntry> =
  Object.fromEntries(FEELINGS_LIBRARY.map(e => [e.id, e]));
