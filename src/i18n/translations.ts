/**
 * App-wide translations — English (en), Korean (ko), Spanish-LatAm (es), Hindi (hi)
 * Add more locales by extending the `Translations` type and adding a key here.
 */

export type Locale = 'en' | 'ko' | 'es' | 'hi';

/** Recursively convert all string literal types → string so other locale values satisfy the type. */
type Loosen<T> =
  T extends string            ? string :
  T extends readonly (infer U)[] ? readonly Loosen<U>[] :
  T extends object            ? { [K in keyof T]: Loosen<T[K]> } :
  T;

export type Translations = Loosen<typeof en>;

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────────────────────────

export const en = {
  // Tab bar
  tabs: {
    home:     'Home',
    breathe:  'Breathe',
    journal:  'Journal',
    today:    'Today',
    emotions: 'Emotions',
    insights: 'Insights',
    settings: 'Settings',
  },

  // Shared mood labels & emojis
  moods: [
    { emoji: '😔', label: 'Rough', value: 1, color: '#E8B4BC' },
    { emoji: '😕', label: 'Low',   value: 2, color: '#F2C4A0' },
    { emoji: '😐', label: 'Okay',  value: 3, color: '#F5E6A0' },
    { emoji: '🙂', label: 'Good',  value: 4, color: '#B8DBC0' },
    { emoji: '😄', label: 'Great', value: 5, color: '#A0C4D0' },
  ] as const,

  // ── PWA install banner ────────────────────────────────────────────────────
  install: {
    title:      'Add to Home Screen',
    bodyIos:    "Tap the Share button (⬆) at the bottom of Safari, then choose 'Add to Home Screen'.",
    bodyOther:  'Install Clarity in Calm for instant access — no app store needed.',
    installBtn: 'Install App',
    dismiss:    'Not now',
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    slides: [
      {
        emoji: '🌿',
        title: 'Welcome to\nClarity in Calm',
        body: 'A quiet space to journal, track emotions, and understand yourself — everything stored privately on this device.',
      },
      {
        emoji: '🗓️',
        title: 'Your Daily Dashboard',
        body: 'The Today tab shows your streak and recent entries, with one-tap shortcuts to check in on how you feel.',
      },
      {
        emoji: '📖',
        title: 'Journal Your Way',
        body: 'Choose from 6 templates — free write, gratitude, reframe, future self, and more. Add tags and search past entries.',
      },
      {
        emoji: '🏷️',
        title: 'Name What You Feel',
        body: 'Tap one of 7 core emotions, or type your own. Add intensity and context tags to understand what drives how you feel.',
      },
      {
        emoji: '📊',
        title: 'Discover Your Patterns',
        body: 'The Insights tab surfaces mood trends, top emotions, and your streak — giving you a clearer picture of your inner world.',
      },
      {
        emoji: '⚙️',
        title: 'Make It Yours',
        body: 'The Settings tab lets you set reminders, switch language, adjust the theme, and manage your data — all in one place.',
      },
      {
        emoji: '🛡️',
        title: 'Built to Protect You',
        body: 'Here is exactly how we keep your entries safe.',
      },
    ],
    next:       'Next',
    getStarted: "Let's go",
    privacy:    '🔒 Your data never leaves your device',
    reportIssue: 'Report an issue',
    shieldChecklist: [
      'Entries are encrypted on your device',
      'Nothing is ever uploaded to a server',
      'No ads, no trackers, no analytics on your journal content',
      'You can export or delete everything, anytime',
    ],
    replayOnboarding: 'View onboarding again',
    languageStepTitle: 'Choose your language',
    languageStepBody: 'Pick the language you’d like to use.',
    pillTip: '💡 Tip: You can switch languages anytime using the pill in the top-left corner.',
    continueLabel: 'Continue',
  },

  // ── Home ──────────────────────────────────────────────────────────────────
  home: {
    greeting: {
      morning:   'Good morning',
      afternoon: 'Good afternoon',
      evening:   'Good evening',
    },
    greetingEmoji: '🌿',
    moodPrompt:    'How are you feeling?',
    moodToday:     "✅  Today's mood",
    startSession:  'Start a session',
    actions: {
      breatheTitle: 'Breathe',
      breatheSub:   'Box breathing · 4 min',
      journalTitle: 'Journal',
      journalSub:   'Reflect & log mood',
      groundTitle:  'Ground',
      groundSub:    '5-4-3-2-1 · Reset now',
    },
    progress: {
      title:    'Your progress',
      streak:   'day streak',
      entries:  'entries',
      sessions: 'sessions',
    },
    streakHow:    'Log a journal entry every day to grow your streak',
    helpBtn:        'Not sure where to go?',
    moodUpdateHint: 'Tap any mood to update',
    todayEntries:   "Today's entries",
    moreEntries:    'more — open Journal to see all',
    gettingStarted: {
      title: "Here's how to start",
      steps: [
        { emoji: '🌬️', label: 'Breathe',  sub: 'Open the Breathe tab for a 4-minute calming session' },
        { emoji: '📖', label: 'Journal',  sub: 'Log your mood and thoughts in the Journal tab' },
        { emoji: '✨', label: 'Progress', sub: 'See your patterns after your first journal entry' },
      ],
    },
  },

  // ── Breathe ───────────────────────────────────────────────────────────────
  breathe: {
    title:    'Breathe',
    subtitle: 'Box breathing · 4 – 4 – 4 – 4',
    phases: {
      inhale: { label: 'Inhale', hint: 'breathe in'    },
      hold1:  { label: 'Hold',   hint: 'hold gently'   },
      exhale: { label: 'Exhale', hint: 'breathe out'   },
      rest:   { label: 'Rest',   hint: 'let it settle' },
    },
    ready:          'Ready',
    tapToStart:     'tap Start to begin',
    naturalBreath:  'get comfortable and breathe naturally',
    followCircle:   'The circle guides each breath — watch it and breathe in sync.',
    round:          'Round',
    endSession:     'End session',
    startBreathing: 'Start breathing',
    infoText:
      'Box breathing activates your parasympathetic nervous system, reducing stress and improving focus. Each phase lasts 4 seconds.',
  },

  // ── Ground ────────────────────────────────────────────────────────────────
  ground: {
    title:    'Grounding',
    subtitle: '5 – 4 – 3 – 2 – 1  ·  Back to now',
    intro:    'Anxiety pulls you out of the present. This 2-minute exercise brings you back by engaging your senses one at a time.',
    steps: [
      { count: 5, emoji: '👁️',  sense: 'See',   instruction: 'Name 5 things you can SEE',            tip: 'Look around slowly — a wall, your hand, a window, a color, a shadow…' },
      { count: 4, emoji: '🤲',  sense: 'Touch',  instruction: 'Name 4 things you can TOUCH or FEEL',  tip: 'Clothes on your skin, floor under your feet, the chair, air temperature…' },
      { count: 3, emoji: '👂',  sense: 'Hear',   instruction: 'Name 3 sounds you can HEAR',           tip: 'Your breath, traffic, a fan, birds, the hum of silence…' },
      { count: 2, emoji: '👃',  sense: 'Smell',  instruction: 'Name 2 things you can SMELL',          tip: 'Your drink, the air, soap, nearby food — or just take a slow breath…' },
      { count: 1, emoji: '👅',  sense: 'Taste',  instruction: 'Name 1 thing you can TASTE',           tip: 'Water, gum, food — or simply notice the taste in your mouth right now…' },
    ] as const,
    next:  'Next',
    done:  'Done',
    complete: {
      emoji: '🌿',
      title: "You're present",
      body:  'Your nervous system has been brought back to now. Take one slow breath and carry this calm with you.',
      again: 'Run again',
      back:  'Back to Home',
    },
    infoText: 'The 5-4-3-2-1 technique interrupts anxious thought spirals by activating your senses. Widely used by therapists worldwide — and it costs nothing.',
  },

  // ── Journal ───────────────────────────────────────────────────────────────
  journal: {
    title:    'Journal',
    subtitle: 'How are you feeling right now?',

    safeSpace: {
      title: 'This is your private space',
      body:  "No one else can see what you write here — not us, not anyone. Say exactly what's on your mind, unfiltered. There's no wrong way to feel.",
    },

    moodLabel:       'Mood',
    reflectionLabel: 'Reflection',
    optionalLabel:   '(optional)',
    placeholder:     'Write freely…',

    prompts: [
      'What made you smile today?',
      "One thing you're grateful for right now…",
      'What felt heavy today?',
      'A small win worth celebrating…',
      'How does your body feel right now?',
    ],

    saveBtn:   'Save entry',
    savedBtn:  '✓  Saved!',
    pastTitle: 'Past entries',

    emptyTitle: 'Your entries will appear here. Start by logging how you feel today.',

    crisis: {
      title: "You're not alone",
      body:
        "It sounds like you might be going through something really heavy right now. That takes courage to write down.\n\nIf you're having thoughts of suicide or self-harm, please reach out — someone is ready to listen right now.",
      lines: [
        {
          emoji:  '📞',
          title:  '988 Suicide & Crisis Lifeline',
          sub:    'Call or text 988 · Free, confidential, 24/7',
          action: 'tel:988',
        },
        {
          emoji:  '💬',
          title:  'Crisis Text Line',
          sub:    'Text HOME to 741741 · Free, 24/7',
          action: 'sms:741741?body=HOME',
        },
        {
          emoji:  '🌍',
          title:  'International helplines',
          sub:    'findahelpline.com · Resources worldwide',
          action: 'https://findahelpline.com',
        },
      ],
      confirmBtn: "I'll reach out for help",
      saveBtn:    'Save my entry anyway',
    },

    // Categorized so every locale is compiler-checked to cover the same concepts —
    // see Loosen<typeof en> below and __tests__/CrisisKeywordsParity.test.ts.
    crisisKeywords: {
      suicidalIdeation: [
        'suicide', 'suicidal', 'kill myself', 'end my life', 'take my life',
        'want to die', 'wanted to die',
      ],
      hopelessness: [
        "don't want to live", 'dont want to live', 'no reason to live',
        'better off dead', 'better off without me', 'not worth living',
      ],
      givingUp: ["can't go on", 'cant go on', 'ending it', 'end it all'],
      selfHarm: ['hurt myself', 'self harm', 'self-harm', 'cutting myself'],
      overdose: ['overdose'],
    },

    deleteConfirm: {
      title:   'Delete entry?',
      body:    'This will permanently remove the entry.',
      confirm: 'Delete',
      cancel:  'Cancel',
    },
  },

  // ── Today ─────────────────────────────────────────────────────────────────
  today: {
    title: 'Today',
    checkIn: 'How are you right now?',
    logEmotion: 'Log emotion',
    streakDays: 'day streak',
    streakStart: 'Start your streak — log an emotion today',
    tools: 'Quick tools',
    breatheTitle: 'Box Breathing',
    breatheSub: '4-4-4-4 · Calm your nervous system',
    groundTitle: '5-4-3-2-1 Grounding',
    groundSub: 'Anchor to the present moment',
    todayEmotions: "Today's emotions",
    noEmotionsYet: 'No emotions logged yet today',
    quote: 'Daily reflection',
    journalEntries: 'journal\nentries',
    emotionsLogged: 'emotions\nlogged',
  },

  // ── Emotions ──────────────────────────────────────────────────────────────
  emotionsScreen: {
    title: 'Emotions',
    subtitle: 'What are you feeling?',
    selectEmotion: 'Tap how you\'re feeling',
    intensity: 'Intensity',
    intensityLow: 'mild',
    intensityHigh: 'intense',
    contextTags: 'What\'s happening?',
    bodyCheckIn: 'Where do you feel it?',
    copingActions: 'What did you do?',
    note: 'Add a note (optional)',
    notePlaceholder: 'Any thoughts about this feeling…',
    saveBtn: 'Log emotion',
    savedBtn: '✓ Logged!',
    pastTitle: 'Recent emotions',
    emptyTitle: 'Your emotion logs will appear here',
    emptyBody: 'Tap an emotion above to log your first one',
    otherPill: '+ Other',
    customPlaceholder: 'Type how you feel…',
    quickLog: 'Quick log',
    fullLog: 'Full log',
    selectedEmotion: 'Selected',
    deleteConfirm: {
      title: 'Delete emotion log?',
      body: 'This will permanently remove this entry.',
      confirm: 'Delete',
      cancel: 'Cancel',
    },
  },

  // ── Feelings Library ─────────────────────────────────────────────────────
  feelingsLibraryScreen: {
    title: 'Feelings Library',
    subtitle: 'Notice it, hear it, ease it',
    cardTitle: 'Feelings Library',
    cardSub: 'Explore 8 common feelings',
    back: 'Back',
    noticeLabel: 'Notice',
    hearLabel: 'Hear',
    feelLabel: 'Feel',
    easeLabel: 'Ease',
    exploreLabel: 'Explore',
    affirmationLabel: 'Based on how you\'re feeling',
  },

  // ── Insights ──────────────────────────────────────────────────────────────
  insightsScreen: {
    title: 'Insights',
    subtitle: 'Your patterns over time',
    monthlyReport: 'This month',
    totalEntries: 'journal entries',
    totalEmotions: 'emotions logged',
    avgIntensity: 'avg intensity',
    topEmotion: 'Most felt',
    topTrigger: 'Top trigger',
    streakRecord: 'Best streak',
    timeOfDay: 'Time of day',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    triggers: 'Emotion triggers',
    noTriggers: 'Log emotions with context tags to see triggers',
    moodCalendar: 'Mood calendar',
    weeklyReview: 'Weekly review',
    weeklyReviewPrompt: 'It\'s Sunday — time to reflect on your week',
    weeklyReviewBtn: 'Start review',
    exportTitle: 'Export your data',
    exportBtn: 'Export as JSON',
    exportSuccess: 'Report saved!',
    empty: {
      title: 'Your insights will build here',
      body: 'Log a few emotions and journal entries to see patterns emerge.',
    },
    last7: 'Last 7 days',
    chartLegend: 'Each dot shows your average mood that day',
    moodBreakdown: 'Mood breakdown',
    streakMotiv: {
      week: 'Amazing! A full week! 🌟',
      days: 'days in a row!',
      sub: "You're building a real self-care habit.",
    },
    insights: {
      title: 'Insights',
      topMood: 'Most logged mood',
      trend: {
        label: 'Mood trend',
        up: '↑ Improving vs last week',
        down: '↓ Declining vs last week',
        flat: '→ Stable vs last week',
        none: 'Log more entries to see your trend',
      },
      bestDay: 'Best day of your week',
      noPattern: 'Keep logging to discover patterns',
    },
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  settingsScreen: {
    title: 'Settings',
    notifications: 'Daily reminder',
    notificationsOff: 'Off',
    notificationsOn: 'On',
    reminderTime: 'Reminder time',
    reminderDays: 'Days',
    appearance: 'Appearance',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
    data: 'Your data',
    exportData: 'Export all data (JSON)',
    shareClarityAI: 'Share data with ClarityAI',
    deleteData: 'Delete all data',
    deleteConfirm: {
      title: 'Delete all data?',
      body: 'This will permanently erase all journal entries, emotion logs, and settings. This cannot be undone.',
      confirm: 'Delete everything',
      cancel: 'Cancel',
    },
    timePicker: {
      title:   'Reminder time',
      hourLabel:   'Hour',
      minuteLabel: 'Min',
      confirm: 'Set reminder',
      cancel:  'Cancel',
    },
    notifPermission: {
      title: 'Permission required',
      body:  'Please enable notifications in your device settings to receive daily reminders.',
    },
    dataDeleted: {
      title: 'Done',
      body:  'All data has been deleted.',
    },
    exportSaved: {
      title:      'Exported',
      bodyPrefix: 'Saved to: ',
    },
    exportFailed: {
      title:        'Export failed',
      fallbackBody: 'Something went wrong.',
    },
    privacy: 'Privacy policy',
    youtube: 'Watch on YouTube',
    version: 'Version',
    daysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    about: 'About',
    aboutBody: 'Clarity in Calm is a private, offline-first wellness journal. All data is encrypted on your device and never leaves it.',
    account: {
      header: 'Account',
      subtitle: 'Sign in to sync and back up your data.',
      signIn: 'Sign in / Create account',
      signOut: 'Sign out',
      deleteAccount: 'Delete account',
      deleteConfirm: {
        title: 'Delete account?',
        body: 'This permanently deletes your account and cannot be undone.',
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      deleteError: {
        title: 'Could not delete account',
        body: 'Please try again.',
      },
    },
  },

  // ── Auth (Supabase sign-in / sign-up / password reset) ────────────────────
  authScreen: {
    signIn: {
      title: 'Welcome back',
      subtitle: 'Sign in to Clarity in Calm.',
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      forgotPassword: 'Forgot password?',
      submit: 'Sign In',
      or: 'or',
      continueWithGoogle: 'Continue with Google',
      noAccountPrefix: "Don't have an account? ",
      signUpLink: 'Sign up',
      errors: {
        missingCredentials: 'Enter your email and password',
        generic: 'Could not sign in. Please try again.',
        google: 'Could not sign in with Google. Please try again.',
      },
    },
    signUp: {
      title: 'Create your account',
      subtitle: 'Sign up to start using Clarity in Calm.',
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 8 characters',
      consentPrefix: 'I agree to the ',
      consentLink: 'Privacy Policy',
      submit: 'Sign Up',
      hasAccountPrefix: 'Already have an account? ',
      signInLink: 'Sign in',
      confirmEmailNotice: 'Check your email to confirm your account',
      errors: {
        missing: 'Enter an email and password',
        passwordTooShort: 'Password must be at least 8 characters',
        consentRequired: 'Please agree to the Privacy Policy to continue',
        generic: 'Could not create account. Please try again.',
      },
    },
    forgotPassword: {
      title: 'Reset your password',
      subtitle: "We'll email you a link to reset your password.",
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      submit: 'Send Reset Link',
      sentBodyPrefix: 'If an account exists for ',
      sentBodySuffix: ", we've sent a link to reset your password.",
      backToSignIn: 'Back to Sign In',
      cancel: 'Cancel',
      errors: {
        missingEmail: 'Enter your email',
        generic: 'Could not send reset email. Please try again.',
      },
    },
    resetPassword: {
      title: 'Set a new password',
      passwordLabel: 'New Password',
      passwordPlaceholder: 'At least 8 characters',
      submit: 'Update Password',
      errors: {
        expiredLink: 'This reset link has expired. Request a new one.',
        passwordTooShort: 'Password must be at least 8 characters',
        generic: 'Could not update password. Please try again.',
      },
    },
    oauth: {
      googleGenericError: 'Could not start Google sign-in',
      appleNoToken: 'Apple sign-in did not return an identity token',
      appleGenericError: 'Could not sign in with Apple. Please try again.',
    },
  },

  // ── Journal (extended) ────────────────────────────────────────────────────
  journalExtended: {
    searchPlaceholder: 'Search entries…',
    templates: 'Templates',
    tags: 'Tags',
    addTag: '+ Add tag',
    calendar: 'Calendar',
    futureSelf: 'Future Self',
    futureSelfTitle: 'Write to your future self',
    futureSelfSubtitle: 'Choose a date to unlock this letter',
    futureSelfLocked: 'Unlocks on',
    futureSelfUnlock: 'Open letter',
    unlockDate: 'Unlock date',
    setDate: 'Set date',
    templateFreeWrite: 'Free Write',
    templateGratitude: 'Gratitude',
    templateReflection: 'Daily Reflection',
    templateCBT: 'Thought Check',
    templateWeeklyReview: 'Weekly Review',
    templateFutureSelf: 'Future Self',
    templatePrompts: {
      gratitude: [
        '1. I am grateful for...',
        '2. Something small that made me smile...',
        '3. A person I appreciate and why...',
      ],
      reflection: [
        'What drained my energy today?',
        'What gave me energy today?',
        'What would I do differently tomorrow?',
      ],
      cbt: [
        'The thought I keep having:',
        'Evidence that supports this thought:',
        'Evidence against this thought:',
        'A more balanced way to see this:',
      ],
      'weekly-review': [
        'What drained me this week?',
        'What energized me this week?',
        'A win I am proud of:',
        'One intention for next week:',
      ],
      'future-self': [
        'Dear future me,',
        'Right now I am feeling...',
        'Something I hope you remember:',
        'A message of encouragement:',
      ],
    },
    noResults: 'No entries match your search',
    customTagPlaceholder: 'custom tag…',
    addTagConfirm: 'Add',
    deleteEntry: 'Delete',
    tagLabels: {
      work: 'work', home: 'home', family: 'family', health: 'health',
      relationship: 'relationship', growth: 'growth', gratitude: 'gratitude',
      stress: 'stress', joy: 'joy', sleep: 'sleep',
    },
  },

  // ── Daily content (quotes + feelings-library affirmations) ────────────────
  dailyContent: {
    quotes: [
      { text: "Take a breath. It's just a bad day, not a bad life.", author: 'Unknown' },
      { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: 'Dan Millman' },
      { text: 'Almost everything will work again if you unplug it for a few minutes — including you.', author: 'Anne Lamott' },
      { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha' },
      { text: 'You are enough. You have always been enough.', author: 'Unknown' },
      { text: 'Within you, there is a stillness and a sanctuary to which you can retreat at any time.', author: 'Hermann Hesse' },
      { text: 'The present moment is the only time over which we have dominion.', author: 'Thich Nhat Hanh' },
      { text: 'Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.', author: 'Oprah Winfrey' },
      { text: 'Self-care is not self-indulgence. It is self-preservation.', author: 'Audre Lorde' },
      { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
      { text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama' },
      { text: "Caring for yourself is not selfish — it's essential.", author: 'Unknown' },
      { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, or anxious.", author: 'Lori Deschene' },
      { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
      { text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo' },
    ],
    feelingsEase: {
      anger: "You're allowed to be angry without acting on every impulse it hands you. Give it a body first — a walk, a few hard exhales — before you give it words.",
      anxiousness: 'You don\'t have to solve every "what if" tonight. Naming one thing you can control right now is usually enough to loosen the loop.',
      burnout: "Rest isn't something you earn after finishing everything — it's what makes finishing anything possible. One thing can wait.",
      fear: "Naming the fear out loud, even just to yourself, takes some of its power away. Ask what's actually happening right now, in this room, versus what your mind is predicting.",
      sadness: "Sadness doesn't need to be fixed right away — it needs room. Let yourself feel it for a few minutes without rushing to feel better.",
      insecurity: "The voice doubting you is not a neutral judge — it's a scared, old habit of thinking. You're allowed to disagree with it.",
      loneliness: "Loneliness shrinks with even small, real contact — a text, a call, sitting somewhere with other people around. It doesn't need to be solved all at once.",
      overwhelm: "You don't have to hold everything at once. Pick the single smallest next step and let the rest wait its turn.",
    },
  },

  emotionsCatalog: {
    basicEmotions: {
      happiness: 'Happiness',
      sadness:   'Sadness',
      fear:      'Fear',
      disgust:   'Disgust',
      anger:     'Anger',
      contempt:  'Contempt',
      surprise:  'Surprise',
    },
    copingActions: {
      breathing:  'Deep breathing',
      journaling: 'Journaling',
      walk:       'Walk/exercise',
      call:       'Called someone',
      rest:       'Rest/sleep',
      music:      'Music',
      meditation: 'Meditation',
      water:      'Drink water',
      grounding:  '5-4-3-2-1',
      nothing:    'Nothing yet',
    },
    bodyRegions: {
  head:      'Head',
  throat:    'Throat',
  chest:     'Chest',
  stomach:   'Stomach',
  shoulders: 'Shoulders',
  arms:      'Arms',
  legs:      'Legs',
  hands:     'Hands',
},
  },

  feelingsLibraryContent: {
    anger: {
      label: 'Anger',
      notice: 'A short fuse, a clenched jaw, snapping at things that wouldn\'t normally bother you. It often arrives fast and wants to be acted on immediately.',
      hear: 'Anger usually says "this isn\'t fair" or "I have to fix this right now." It\'s protecting a boundary that got crossed, even if the target of your anger isn\'t the real cause.',
      feel: 'Heat in the chest and face, tight fists or jaw, a racing pulse, an urge to move or speak sharply.',
      explore: [
        'What boundary feels crossed right now — and is it really this moment, or something older?',
        'If you said the honest version of what you\'re thinking, what would it be?',
        'What would "handled" actually look like a day from now?',
      ],
    },
    anxiousness: {
      label: 'Anxiousness',
      notice: 'Racing thoughts that jump between worst-case scenarios, restlessness, checking things over and over, trouble settling on one task.',
      hear: 'Anxiousness tends to say "what if" on a loop. It\'s trying to prepare you for danger by rehearsing every version of it in advance.',
      feel: 'A fluttering or tight stomach, shallow breathing, a jittery or wired feeling in the limbs.',
      explore: [
        'Which part of this worry is actually within your control today?',
        'What\'s the story your mind is telling, and what evidence actually supports it?',
        'What has helped you get through uncertainty before?',
      ],
    },
    burnout: {
      label: 'Burnout',
      notice: 'Flatness where drive used to be, dragging through tasks you normally handle easily, a sense that even rest doesn\'t refill you.',
      hear: 'Burnout says "I should be able to keep going" long after the tank is empty. It mistakes exhaustion for a character flaw instead of a signal.',
      feel: 'Heaviness in the limbs, foggy thinking, a dull ache behind the eyes, low motivation even for things you enjoy.',
      explore: [
        'What has quietly been non-negotiable that could actually be renegotiated?',
        'When did you last feel like yourself, and what was different that day?',
        'If you gave yourself permission to do less this week, what would you drop first?',
      ],
    },
    fear: {
      label: 'Fear',
      notice: 'A sudden alertness, wanting to avoid or escape a specific situation, a mind that keeps circling back to the threat.',
      hear: 'Fear says "this could hurt me" and narrows your focus to the danger. It\'s an old, fast system trying to keep you safe, even when the threat is more uncertain than physical.',
      feel: 'A jolt in the chest, cold hands, a held breath, muscles ready to move.',
      explore: [
        'What specifically are you afraid will happen, in concrete terms?',
        'Has this fear been right before, or does it tend to overestimate the danger?',
        'What\'s one small step toward the thing you\'re avoiding?',
      ],
    },
    sadness: {
      label: 'Sadness',
      notice: 'Low energy, tearfulness, wanting to withdraw or go quiet, things that used to feel light now feeling heavy.',
      hear: 'Sadness says "something mattered and it\'s gone, or going." It\'s the natural response to loss, even loss that\'s hard to name.',
      feel: 'A heaviness in the chest, a lump in the throat, tired eyes, a slower body.',
      explore: [
        'What, specifically, feels like it\'s been lost?',
        'Who or what would help just by being nearby right now?',
        'What would comfort — not distraction — look like today?',
      ],
    },
    insecurity: {
      label: 'Insecurity',
      notice: 'Second-guessing your choices, comparing yourself to others, a voice that finds fault before anyone else does.',
      hear: 'Insecurity says "you\'re not enough" or "they\'ll find out." It\'s often an old fear of not belonging, wearing the costume of self-criticism.',
      feel: 'A sinking feeling in the stomach, shrinking posture, warmth in the face (shame\'s close cousin).',
      explore: [
        'Whose voice does this criticism actually sound like?',
        'What would you say to a friend who felt exactly this way?',
        'What\'s one piece of real evidence that contradicts the doubt?',
      ],
    },
    loneliness: {
      label: 'Loneliness',
      notice: 'A quiet ache even around other people, a pull to isolate further, a sense of being unseen or unreachable.',
      hear: 'Loneliness says "no one really gets it" or "I\'m on my own here." It\'s a signal that connection is missing, not proof that it\'s unavailable.',
      feel: 'A hollow feeling in the chest, low energy, a heaviness that settles in quiet moments.',
      explore: [
        'Who is one person you could reach out to today, even briefly?',
        'When did you last feel truly understood, and what made that possible?',
        'Is this loneliness about being alone, or about feeling unseen?',
      ],
    },
    overwhelm: {
      label: 'Overwhelm',
      notice: 'Too many things pulling at once, difficulty deciding where to start, a foggy or frozen feeling instead of clear thinking.',
      hear: 'Overwhelm says "there\'s too much and not enough of me." It\'s not that you can\'t handle things — it\'s that too many things are asking for attention at the same time.',
      feel: 'A tight chest, shallow breathing, a buzzing or scattered feeling in the head, restlessness or freezing.',
      explore: [
        'If you could only do one thing today, what would actually matter most?',
        'What\'s something on your plate that could be delayed, dropped, or handed off?',
        'What would it feel like to do this imperfectly instead of not at all?',
      ],
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// KOREAN  (한국어)
// ─────────────────────────────────────────────────────────────────────────────

export const ko: Translations = {
  tabs: {
    home:     '홈',
    breathe:  '호흡',
    journal:  '일기',
    today:    '오늘',
    emotions: '감정',
    insights: '분석',
    settings: '설정',
  },

  moods: [
    { emoji: '😔', label: '힘들어요',    value: 1, color: '#E8B4BC' },
    { emoji: '😕', label: '우울해요',    value: 2, color: '#F2C4A0' },
    { emoji: '😐', label: '그냥 그래요', value: 3, color: '#F5E6A0' },
    { emoji: '🙂', label: '좋아요',      value: 4, color: '#B8DBC0' },
    { emoji: '😄', label: '아주 좋아요', value: 5, color: '#A0C4D0' },
  ],

  install: {
    title:      '홈 화면에 추가하기',
    bodyIos:    "Safari 하단의 공유 버튼(⬆)을 탭한 후 '홈 화면에 추가'를 선택하세요.",
    bodyOther:  'Clarity in Calm을 설치하면 앱스토어 없이 바로 접근할 수 있어요.',
    installBtn: '앱 설치',
    dismiss:    '나중에',
  },

  onboarding: {
    slides: [
      {
        emoji: '🌿',
        title: 'Clarity in Calm에\n오신 것을 환영해요',
        body: '일기를 쓰고, 감정을 기록하고, 자신을 이해하는 조용한 공간 — 모든 것이 이 기기에 안전하게 저장돼요.',
      },
      {
        emoji: '🗓️',
        title: '오늘의 대시보드',
        body: '오늘 탭에서 연속 기록과 최근 항목을 확인하고, 버튼 하나로 지금 기분을 기록해보세요.',
      },
      {
        emoji: '📖',
        title: '나만의 방식으로 쓰는 일기',
        body: '6가지 템플릿 중 선택하세요 — 자유 쓰기, 감사, 재구성, 미래의 나에게 등. 태그를 추가하고 이전 항목을 검색하세요.',
      },
      {
        emoji: '🏷️',
        title: '느끼는 감정에 이름 붙이기',
        body: '7가지 기본 감정 중 하나를 선택하거나 직접 입력하세요. 강도와 맥락 태그를 추가해 자신의 감정을 더 잘 이해해보세요.',
      },
      {
        emoji: '📊',
        title: '패턴 발견하기',
        body: '인사이트 탭에서 기분 추세, 주요 감정, 연속 기록을 확인해 나의 내면 세계를 더 명확히 살펴보세요.',
      },
      {
        emoji: '⚙️',
        title: '나에게 맞게 설정하기',
        body: '설정 탭에서 알림, 언어, 테마를 조정하고 데이터를 관리할 수 있어요 — 모두 한곳에서.',
      },
      {
        emoji: '🛡️',
        title: '당신을 지키는 방식',
        body: '기록이 어떻게 안전하게 보호되는지 알려드릴게요.',
      },
    ],
    next:       '다음',
    getStarted: '시작하기',
    privacy:    '🔒 데이터는 절대 이 기기를 벗어나지 않아요',
    reportIssue: '문제 신고하기',
    shieldChecklist: [
      '기록은 기기에서 암호화돼요',
      '어떤 서버에도 업로드되지 않아요',
      '일기 내용에는 광고, 추적기, 분석 도구가 전혀 없어요',
      '언제든지 모든 데이터를 내보내거나 삭제할 수 있어요',
    ],
    replayOnboarding: '온보딩 다시 보기',
    languageStepTitle: '언어를 선택하세요',
    languageStepBody: '사용하고 싶은 언어를 선택해주세요.',
    pillTip: '💡 팁: 화면 왼쪽 상단의 알약 모양 버튼으로 언제든지 언어를 바꿀 수 있어요.',
    continueLabel: '계속하기',
  },

  home: {
    greeting: {
      morning:   '좋은 아침이에요',
      afternoon: '좋은 오후에요',
      evening:   '좋은 저녁이에요',
    },
    greetingEmoji: '🌿',
    moodPrompt:    '지금 기분이 어떠세요?',
    moodToday:     '✅  오늘의 기분',
    startSession:  '세션 시작하기',
    actions: {
      breatheTitle: '호흡하기',
      breatheSub:   '박스 호흡 · 4분',
      journalTitle: '일기 쓰기',
      journalSub:   '기분 기록하기',
      groundTitle:  '그라운딩',
      groundSub:    '5-4-3-2-1 · 지금 안정하기',
    },
    progress: {
      title:    '나의 진행 상황',
      streak:   '일 연속',
      entries:  '기록',
      sessions: '세션',
    },
    streakHow:    '매일 일기를 작성하면 연속 기록이 늘어나요',
    helpBtn:        '어디서 시작할지 모르겠어요?',
    moodUpdateHint: '기분을 탭해서 수정하세요',
    todayEntries:   '오늘의 기록',
    moreEntries:    '개 더 있어요 — 일기 탭에서 모두 보기',
    gettingStarted: {
      title: '이렇게 시작하세요',
      steps: [
        { emoji: '🌬️', label: '호흡하기',    sub: '4분 호흡 세션을 위해 호흡 탭을 열어보세요' },
        { emoji: '📖', label: '일기 쓰기',   sub: '일기 탭에서 기분과 생각을 기록하세요' },
        { emoji: '✨', label: '진행 확인하기', sub: '첫 번째 기록 후 패턴을 확인해보세요' },
      ],
    },
  },

  breathe: {
    title:    '호흡',
    subtitle: '박스 호흡 · 4 – 4 – 4 – 4',
    phases: {
      inhale: { label: '들이쉬기', hint: '천천히 들이쉬세요'  },
      hold1:  { label: '참기',     hint: '부드럽게 참으세요' },
      exhale: { label: '내쉬기',   hint: '천천히 내쉬세요'   },
      rest:   { label: '쉬기',     hint: '편안히 쉬세요'     },
    },
    ready:          '준비',
    tapToStart:     '시작을 눌러주세요',
    naturalBreath:  '편안한 자세로 자연스럽게 호흡하세요',
    followCircle:   '원이 각 호흡을 안내해요 — 원을 바라보며 함께 호흡하세요.',
    round:          '라운드',
    endSession:     '세션 종료',
    startBreathing: '호흡 시작',
    infoText:
      '박스 호흡은 부교감 신경계를 활성화하여 스트레스를 줄이고 집중력을 향상시킵니다. 각 단계는 4초입니다.',
  },

  ground: {
    title:    '그라운딩',
    subtitle: '5 – 4 – 3 – 2 – 1  ·  지금 이 순간으로',
    intro:    '불안은 당신을 현재에서 끌어냅니다. 이 2분짜리 운동은 감각을 하나씩 활성화하여 현재로 되돌려줘요.',
    steps: [
      { count: 5, emoji: '👁️',  sense: '보이는 것', instruction: '지금 볼 수 있는 것 5가지',       tip: '천천히 주위를 살펴보세요 — 벽, 손, 창문, 색깔, 그림자…' },
      { count: 4, emoji: '🤲',  sense: '느끼는 것', instruction: '몸으로 느낄 수 있는 것 4가지',   tip: '바닥에 닿은 발, 옷감, 의자, 공기의 온도…' },
      { count: 3, emoji: '👂',  sense: '들리는 것', instruction: '들을 수 있는 소리 3가지',         tip: '숨소리, 차 소리, 선풍기, 새소리, 고요함의 소음…' },
      { count: 2, emoji: '👃',  sense: '냄새',      instruction: '맡을 수 있는 것 2가지',           tip: '음료, 공기, 비누, 음식 — 아니면 천천히 숨을 들이마시세요…' },
      { count: 1, emoji: '👅',  sense: '맛',        instruction: '느낄 수 있는 맛 1가지',           tip: '물, 껌, 음식 — 아니면 지금 입 안의 맛을 느껴보세요…' },
    ] as const,
    next:  '다음',
    done:  '완료',
    complete: {
      emoji: '🌿',
      title: '지금 여기에 있어요',
      body:  '신경계가 현재 순간으로 돌아왔어요. 천천히 한 번 숨을 쉬고, 이 평온함을 이어가세요.',
      again: '다시 하기',
      back:  '홈으로',
    },
    infoText: '5-4-3-2-1 기법은 감각을 활성화해 불안한 생각의 소용돌이를 끊어줘요. 전 세계 치료사들이 활용하는 방법이고, 아무런 도구도 필요 없어요.',
  },

  journal: {
    title:    '일기',
    subtitle: '지금 기분이 어떠세요?',

    safeSpace: {
      title: '이곳은 당신만의 공간이에요',
      body:  '여기에 쓰는 내용은 아무도 볼 수 없어요 — 우리도, 누구도요. 필터 없이 솔직하게 마음을 털어놓으세요. 어떤 감정이든 틀린 것은 없어요.',
    },

    moodLabel:       '기분',
    reflectionLabel: '오늘의 생각',
    optionalLabel:   '(선택사항)',
    placeholder:     '자유롭게 써보세요…',

    prompts: [
      '오늘 어떤 일이 미소 짓게 했나요?',
      '지금 감사한 것 한 가지...',
      '오늘 힘들었던 일은 무엇인가요?',
      '오늘 칭찬받을 만한 작은 성취...',
      '지금 몸 상태는 어떤가요?',
    ],

    saveBtn:   '저장하기',
    savedBtn:  '✓  저장됨!',
    pastTitle: '이전 기록',

    emptyTitle: '기록이 여기에 나타납니다. 지금 기분을 기록해보세요.',

    crisis: {
      title: '혼자가 아니에요',
      body:
        '지금 많이 힘드신 것 같아요. 이렇게 솔직하게 쓰신 것만으로도 정말 용감한 일이에요.\n\n자해나 자살에 대한 생각이 드신다면, 지금 바로 도움을 받으세요 — 언제든지 들어줄 준비가 되어 있어요.',
      lines: [
        {
          emoji:  '📞',
          title:  '자살예방상담전화 1393',
          sub:    '24시간, 무료, 비밀 보장',
          action: 'tel:1393',
        },
        {
          emoji:  '💙',
          title:  '정신건강 위기상담전화 1577-0199',
          sub:    '24시간, 무료',
          action: 'tel:15770199',
        },
        {
          emoji:  '🌿',
          title:  '생명의전화 1588-9191',
          sub:    '24시간, 무료',
          action: 'tel:15889191',
        },
      ],
      confirmBtn: '도움을 받겠습니다',
      saveBtn:    '그래도 저장하기',
    },

    crisisKeywords: {
      suicidalIdeation: [
        '자살', '자살하고 싶다', '자살하고싶다',
        '죽고 싶다', '죽고싶다', '죽어버리고 싶다', '죽고 싶어',
        '목숨을 끊다', '스스로 목숨을 끊다',
        '죽겠다', '죽을 것 같다',
      ],
      hopelessness: ['살기 싫다', '살기싫다', '살고 싶지 않다', '더 이상 살고 싶지 않다', '죽는 게 낫다'],
      givingUp: ['삶을 끝내고 싶다', '삶을 포기', '삶을 포기하고 싶다', '사라지고 싶다'],
      selfHarm: ['자해', '스스로를 해치다', '스스로 해치고 싶다'],
      overdose: ['약물 과다복용', '과다복용'],
    },

    deleteConfirm: {
      title:   '기록을 삭제할까요?',
      body:    '이 기록은 영구적으로 삭제됩니다.',
      confirm: '삭제',
      cancel:  '취소',
    },
  },

  today: { title: '오늘', checkIn: '지금 기분이 어떠세요?', logEmotion: '감정 기록', streakDays: '일 연속', streakStart: '오늘 감정을 기록해 스트릭을 시작하세요', tools: '빠른 도구', breatheTitle: '박스 호흡', breatheSub: '4-4-4-4 · 신경계 안정', groundTitle: '5-4-3-2-1 그라운딩', groundSub: '현재 순간에 집중하기', todayEmotions: '오늘의 감정', noEmotionsYet: '오늘 아직 기록된 감정이 없어요', quote: '오늘의 명언', journalEntries: '일기\n기록', emotionsLogged: '감정\n기록' },
  feelingsLibraryScreen: { title: '감정 라이브러리', subtitle: '알아차리고, 듣고, 편안하게', cardTitle: '감정 라이브러리', cardSub: '8가지 감정 탐색하기', back: '뒤로', noticeLabel: '알아차리기', hearLabel: '듣기', feelLabel: '느끼기', easeLabel: '편안하게', exploreLabel: '탐구하기', affirmationLabel: '지금 느끼는 감정에 맞춰' },
  emotionsScreen: { title: '감정', subtitle: '지금 어떤 감정인가요?', selectEmotion: '지금 느끼는 감정을 탭하세요', intensity: '강도', intensityLow: '약함', intensityHigh: '강함', contextTags: '지금 무슨 상황인가요?', bodyCheckIn: '어디서 느껴지나요?', copingActions: '어떻게 했나요?', note: '노트 추가 (선택사항)', notePlaceholder: '이 감정에 대한 생각…', saveBtn: '감정 기록하기', savedBtn: '✓ 저장됨!', pastTitle: '최근 감정', emptyTitle: '감정 기록이 여기 나타납니다', emptyBody: '위에서 감정을 탭해 첫 감정을 기록하세요', otherPill: '+ 기타', customPlaceholder: '느끼는 감정을 입력하세요…', quickLog: '빠른 기록', fullLog: '전체 기록', selectedEmotion: '선택됨', deleteConfirm: { title: '감정 기록 삭제?', body: '이 항목이 영구적으로 삭제됩니다.', confirm: '삭제', cancel: '취소' } },
  insightsScreen: { title: '분석', subtitle: '시간에 따른 패턴', monthlyReport: '이번 달', totalEntries: '일기 기록', totalEmotions: '감정 기록', avgIntensity: '평균 강도', topEmotion: '가장 많이 느낀 감정', topTrigger: '주요 트리거', streakRecord: '최고 스트릭', timeOfDay: '시간대', morning: '아침', afternoon: '오후', evening: '저녁', night: '밤', triggers: '감정 트리거', noTriggers: '감정 기록에 상황 태그를 추가하면 트리거가 보여요', moodCalendar: '기분 달력', weeklyReview: '주간 회고', weeklyReviewPrompt: '일요일이에요 — 이번 주를 되돌아볼 시간이에요', weeklyReviewBtn: '회고 시작', exportTitle: '데이터 내보내기', exportBtn: 'JSON으로 내보내기', exportSuccess: '저장됨!', empty: { title: '인사이트가 여기 만들어집니다', body: '감정과 일기를 몇 개 기록하면 패턴이 보여요.' }, last7: '최근 7일', chartLegend: '각 점은 그날의 평균 기분', moodBreakdown: '기분 분석', streakMotiv: { week: '대단해요! 일주일! 🌟', days: '일 연속!', sub: '진정한 자기 관리 습관이에요.' }, insights: { title: '인사이트', topMood: '가장 많이 기록한 기분', trend: { label: '기분 추세', up: '↑ 지난 주보다 나아지고 있어요', down: '↓ 지난 주보다 낮아졌어요', flat: '→ 지난 주와 비슷해요', none: '추세를 보려면 더 기록해보세요' }, bestDay: '기분이 가장 좋은 요일', noPattern: '매일 기록하면 패턴이 보여요' } },
  settingsScreen: { title: '설정', notifications: '매일 알림', notificationsOff: '끄기', notificationsOn: '켜기', reminderTime: '알림 시간', reminderDays: '요일', appearance: '외관', themeSystem: '시스템', themeLight: '밝은', themeDark: '어두운', language: '언어', data: '내 데이터', exportData: '전체 데이터 내보내기 (JSON)', shareClarityAI: 'ClarityAI와 데이터 공유', deleteData: '전체 데이터 삭제', deleteConfirm: { title: '전체 데이터를 삭제할까요?', body: '모든 일기, 감정 기록, 설정이 영구적으로 삭제됩니다. 취소할 수 없어요.', confirm: '모두 삭제', cancel: '취소' }, timePicker: { title: '알림 시간', hourLabel: '시', minuteLabel: '분', confirm: '알림 설정', cancel: '취소' }, notifPermission: { title: '알림 권한이 필요해요', body: '매일 알림을 받으려면 기기 설정에서 알림을 켜주세요.' }, dataDeleted: { title: '완료', body: '모든 데이터가 삭제되었습니다.' }, exportSaved: { title: '내보내기 완료', bodyPrefix: '저장 위치: ' }, exportFailed: { title: '내보내기 실패', fallbackBody: '문제가 발생했습니다.' }, privacy: '개인정보 처리방침', youtube: 'YouTube에서 보기', version: '버전', daysShort: ['일', '월', '화', '수', '목', '금', '토'], about: '앱 정보', aboutBody: 'Clarity in Calm은 오프라인 우선 웰니스 앱입니다. 모든 데이터는 기기에 암호화되어 저장됩니다.', account: { header: '계정', subtitle: '로그인하면 데이터를 동기화하고 백업할 수 있어요.', signIn: '로그인 / 계정 만들기', signOut: '로그아웃', deleteAccount: '계정 삭제', deleteConfirm: { title: '계정을 삭제할까요?', body: '계정이 영구적으로 삭제되며 취소할 수 없습니다.', confirm: '삭제', cancel: '취소' }, deleteError: { title: '계정을 삭제할 수 없습니다', body: '다시 시도해 주세요.' } } },
  authScreen: { signIn: { title: '다시 오신 것을 환영해요', subtitle: 'Clarity in Calm에 로그인하세요.', emailLabel: '이메일', emailPlaceholder: 'email@example.com', passwordLabel: '비밀번호', passwordPlaceholder: '••••••••', forgotPassword: '비밀번호를 잊으셨나요?', submit: '로그인', or: '또는', continueWithGoogle: 'Google로 계속하기', noAccountPrefix: '계정이 없으신가요? ', signUpLink: '회원가입', errors: { missingCredentials: '이메일과 비밀번호를 입력하세요', generic: '로그인할 수 없습니다. 다시 시도해 주세요.', google: 'Google 로그인에 실패했습니다. 다시 시도해 주세요.' } }, signUp: { title: '계정 만들기', subtitle: 'Clarity in Calm을 시작하려면 가입하세요.', emailLabel: '이메일', emailPlaceholder: 'email@example.com', passwordLabel: '비밀번호', passwordPlaceholder: '8자 이상 입력하세요', consentPrefix: '', consentLink: '개인정보 처리방침에 동의합니다', submit: '회원가입', hasAccountPrefix: '이미 계정이 있으신가요? ', signInLink: '로그인', confirmEmailNotice: '계정을 확인하려면 이메일을 확인하세요', errors: { missing: '이메일과 비밀번호를 입력하세요', passwordTooShort: '비밀번호는 8자 이상이어야 합니다', consentRequired: '계속하려면 개인정보 처리방침에 동의해 주세요', generic: '계정을 만들 수 없습니다. 다시 시도해 주세요.' } }, forgotPassword: { title: '비밀번호 재설정', subtitle: '비밀번호를 재설정할 수 있는 링크를 이메일로 보내드릴게요.', emailLabel: '이메일', emailPlaceholder: 'email@example.com', submit: '재설정 링크 보내기', sentBodyPrefix: '만약 ', sentBodySuffix: '에 대한 계정이 있다면, 비밀번호 재설정 링크를 보내드렸어요.', backToSignIn: '로그인으로 돌아가기', cancel: '취소', errors: { missingEmail: '이메일을 입력하세요', generic: '재설정 이메일을 보낼 수 없습니다. 다시 시도해 주세요.' } }, resetPassword: { title: '새 비밀번호 설정', passwordLabel: '새 비밀번호', passwordPlaceholder: '8자 이상 입력하세요', submit: '비밀번호 변경', errors: { expiredLink: '재설정 링크가 만료되었습니다. 새 링크를 요청하세요.', passwordTooShort: '비밀번호는 8자 이상이어야 합니다', generic: '비밀번호를 변경할 수 없습니다. 다시 시도해 주세요.' } }, oauth: { googleGenericError: 'Google 로그인을 시작할 수 없습니다', appleNoToken: 'Apple 로그인에서 인증 토큰을 받지 못했습니다', appleGenericError: 'Apple 로그인에 실패했습니다. 다시 시도해 주세요.' } },
  journalExtended: { searchPlaceholder: '기록 검색…', templates: '템플릿', tags: '태그', addTag: '+ 태그 추가', calendar: '달력', futureSelf: '미래의 나', futureSelfTitle: '미래의 나에게 쓰기', futureSelfSubtitle: '이 편지를 열 날짜를 선택하세요', futureSelfLocked: '열리는 날짜', futureSelfUnlock: '편지 열기', unlockDate: '해제 날짜', setDate: '날짜 설정', templateFreeWrite: '자유 쓰기', templateGratitude: '감사', templateReflection: '하루 회고', templateCBT: '생각 점검', templateWeeklyReview: '주간 회고', templateFutureSelf: '미래의 나', templatePrompts: { gratitude: ['1. 감사한 것은...', '2. 오늘 나를 미소 짓게 한 작은 일...', '3. 내가 고맙게 여기는 사람과 그 이유...'], reflection: ['오늘 나를 지치게 한 것은?', '오늘 나에게 힘을 준 것은?', '내일은 무엇을 다르게 해볼까?'], cbt: ['계속 떠오르는 생각:', '이 생각을 뒷받침하는 근거:', '이 생각에 반대되는 근거:', '더 균형 잡힌 시각:'], 'weekly-review': ['이번 주 나를 지치게 한 것은?', '이번 주 나에게 힘을 준 것은?', '자랑스러운 성취:', '다음 주를 위한 다짐 하나:'], 'future-self': ['미래의 나에게,', '지금 나는 이런 기분이야...', '꼭 기억했으면 하는 것:', '응원의 한마디:'] }, noResults: '검색 결과가 없어요', customTagPlaceholder: '태그 입력…', addTagConfirm: '추가', deleteEntry: '삭제', tagLabels: { work: '업무', home: '집', family: '가족', health: '건강', relationship: '관계', growth: '성장', gratitude: '감사', stress: '스트레스', joy: '기쁨', sleep: '수면' } },
  dailyContent: {
    quotes: [
      { text: '숨을 쉬어보세요. 그저 힘든 하루일 뿐, 힘든 인생이 아니에요.', author: '작자 미상' },
      { text: '생각을 통제할 필요는 없어요. 그저 생각이 나를 지배하지 못하게 하면 됩니다.', author: '댄 밀먼' },
      { text: '거의 모든 것은 몇 분만 전원을 꺼두면 다시 제대로 작동해요 — 당신도 마찬가지예요.', author: '앤 라모트' },
      { text: '평화는 내면에서 옵니다. 밖에서 찾으려 하지 마세요.', author: '붓다' },
      { text: '당신은 이미 충분해요. 언제나 그래왔어요.', author: '작자 미상' },
      { text: '당신 안에는 언제든 물러나 쉴 수 있는 고요함과 안식처가 있습니다.', author: '헤르만 헤세' },
      { text: '지금 이 순간이야말로 우리가 다스릴 수 있는 유일한 시간입니다.', author: '틱낫한' },
      { text: '숨을 쉬세요. 내려놓으세요. 그리고 지금 이 순간이야말로 당신이 확실히 가진 유일한 순간임을 기억하세요.', author: '오프라 윈프리' },
      { text: '자기 돌봄은 자기 방종이 아닙니다. 그것은 자기 보존입니다.', author: '오드리 로드' },
      { text: '어려움의 한가운데에 기회가 있습니다.', author: '알베르트 아인슈타인' },
      { text: '행복은 이미 만들어져 있는 것이 아닙니다. 그것은 당신 자신의 행동에서 옵니다.', author: '달라이 라마' },
      { text: '자신을 돌보는 것은 이기적인 것이 아니라 꼭 필요한 일이에요.', author: '작자 미상' },
      { text: '항상 긍정적일 필요는 없어요. 슬프거나 화나거나 짜증 나거나 불안해도 전혀 괜찮습니다.', author: '로리 디셴' },
      { text: '지금 있는 곳에서 시작하세요. 가진 것을 활용하세요. 할 수 있는 것을 하세요.', author: '아서 애시' },
      { text: '아무리 어두운 밤도 끝나고, 해는 다시 떠오릅니다.', author: '빅토르 위고' },
    ],
    feelingsEase: {
      anger: '화가 나도 그 충동에 매번 따를 필요는 없어요. 말로 표현하기 전에 먼저 몸을 움직여보세요 — 산책을 하거나 크게 숨을 몇 번 내쉬어 보세요.',
      anxiousness: "오늘 밤 모든 '만약에'를 해결할 필요는 없어요. 지금 당장 통제할 수 있는 한 가지를 말해보는 것만으로도 그 굴레를 느슨하게 하기에 충분해요.",
      burnout: '휴식은 모든 걸 끝낸 뒤에 얻는 보상이 아니라, 무언가를 끝낼 수 있게 해주는 힘이에요. 한 가지 정도는 미뤄도 괜찮아요.',
      fear: '두려움을 소리 내어 말해보는 것만으로도 — 자신에게라도 — 그 힘이 조금은 줄어들어요. 지금 이 순간 실제로 무슨 일이 일어나고 있는지, 마음이 예측하는 것과 비교해보세요.',
      sadness: '슬픔은 당장 고쳐야 할 문제가 아니라 머물 공간이 필요한 감정이에요. 서둘러 나아지려 하지 말고, 몇 분만이라도 그 감정을 그대로 느껴보세요.',
      insecurity: '당신을 의심하는 그 목소리는 공정한 심판이 아니에요 — 그것은 두려움에서 비롯된 오래된 생각 습관일 뿐이에요. 그 목소리에 동의하지 않아도 괜찮아요.',
      loneliness: '외로움은 작은 진짜 연결만으로도 줄어들어요 — 문자 한 통, 전화 한 통, 사람들 곁에 잠시 앉아 있는 것만으로도요. 한 번에 다 해결할 필요는 없어요.',
      overwhelm: '모든 것을 한꺼번에 짊어질 필요는 없어요. 가장 작은 다음 한 걸음을 골라보고, 나머지는 차례를 기다리게 두세요.',
    },
  },

  emotionsCatalog: {
    basicEmotions: {
      happiness: '행복',
      sadness:   '슬픔',
      fear:      '두려움',
      disgust:   '혐오',
      anger:     '분노',
      contempt:  '경멸',
      surprise:  '놀람',
    },
    copingActions: {
      breathing:  '심호흡',
      journaling: '일기 쓰기',
      walk:       '산책/운동',
      call:       '전화 통화',
      rest:       '휴식/수면',
      music:      '음악',
      meditation: '명상',
      water:      '물 마시기',
      grounding:  '5-4-3-2-1',
      nothing:    '아직 없음',
    },
     bodyRegions: {
  head:      '머리',
  throat:    '목',
  chest:     '가슴',
  stomach:   '배',
  shoulders: '어깨',
  arms:      '팔',
  legs:      '다리',
  hands:     '손',
},
  },

  feelingsLibraryContent: {
    anger: {
      label: '분노',
      notice: '짧은 도화선, 굳게 다문 턱, 평소라면 신경 쓰지 않았을 일에도 날카롭게 반응하게 돼요. 보통 빠르게 찾아오고 즉각 행동으로 옮기고 싶어져요.',
      hear: '분노는 대개 "이건 불공평해" 또는 "지금 당장 바로잡아야 해"라고 말해요. 화의 대상이 진짜 원인이 아니더라도, 이는 침범당한 경계를 지키려는 신호예요.',
      feel: '가슴과 얼굴의 열감, 꽉 쥔 주먹이나 턱, 빨라지는 맥박, 움직이거나 날카롭게 말하고 싶은 충동.',
      explore: [
        '지금 느껴지는 경계 침범은 정말 지금 이 순간의 일인가요, 아니면 더 오래된 무언가인가요?',
        '지금 생각하는 것을 솔직하게 말한다면 무엇일까요?',
        '하루 뒤에 "해결됐다"는 건 실제로 어떤 모습일까요?',
      ],
    },
    anxiousness: {
      label: '불안',
      notice: '최악의 시나리오 사이를 오가는 질주하는 생각들, 안절부절못함, 반복해서 확인하기, 한 가지 일에 집중하기 어려움.',
      hear: '불안은 보통 "만약에"를 반복해서 말해요. 모든 위험의 버전을 미리 연습시켜서 당신을 대비시키려는 거예요.',
      feel: '속이 두근거리거나 답답함, 얕은 호흡, 팔다리의 불안정하거나 들뜬 느낌.',
      explore: [
        '이 걱정 중 오늘 당신이 실제로 통제할 수 있는 부분은 무엇인가요?',
        '마음이 들려주는 이야기는 무엇이고, 실제로 그것을 뒷받침하는 증거는 무엇인가요?',
        '예전에 불확실함을 이겨내는 데 도움이 됐던 것은 무엇이었나요?',
      ],
    },
    burnout: {
      label: '번아웃',
      notice: '예전엔 있던 의욕이 사라진 무기력함, 평소엔 쉽게 하던 일도 힘겹게 끌고 가는 느낌, 쉬어도 채워지지 않는 느낌.',
      hear: '번아웃은 "계속할 수 있어야 해"라고 오랫동안 말하지만, 이미 에너지는 바닥난 상태예요. 지쳐 있는 것을 신호가 아니라 성격 결함으로 착각하게 만들어요.',
      feel: '팔다리의 무거움, 흐릿한 사고, 눈 뒤의 둔한 통증, 좋아하는 일에도 낮은 의욕.',
      explore: [
        '조용히 "당연한 일"이 되어버렸지만 사실 다시 협상할 수 있는 것은 무엇인가요?',
        '가장 최근에 나다운 느낌이 들었던 건 언제였고, 그날 무엇이 달랐나요?',
        '이번 주에 조금 덜 해도 괜찮다고 스스로에게 허락한다면, 무엇을 가장 먼저 내려놓을까요?',
      ],
    },
    fear: {
      label: '두려움',
      notice: '갑작스러운 경계심, 특정 상황을 피하거나 벗어나고 싶은 마음, 계속 위협으로 되돌아가는 생각.',
      hear: '두려움은 "이건 나를 다치게 할 수 있어"라고 말하며 초점을 위협에 좁혀요. 위협이 신체적이라기보다 불확실한 것이라 해도, 당신을 안전하게 지키려는 오래되고 빠른 시스템이에요.',
      feel: '가슴의 찌릿함, 차가운 손, 멈춘 숨, 움직일 준비가 된 근육.',
      explore: [
        '구체적으로 무엇이 일어날까 봐 두려운가요?',
        '이 두려움이 예전에 맞았던 적이 있나요, 아니면 위험을 과대평가하는 경향이 있나요?',
        '피하고 있는 그 일을 향한 작은 한 걸음은 무엇일까요?',
      ],
    },
    sadness: {
      label: '슬픔',
      notice: '낮은 에너지, 눈물, 물러나거나 조용해지고 싶은 마음, 예전엔 가볍게 느껴지던 것들이 무겁게 느껴짐.',
      hear: '슬픔은 "무언가가 중요했고, 그것이 사라지고 있다"고 말해요. 이름 붙이기 어려운 상실이라도, 상실에 대한 자연스러운 반응이에요.',
      feel: '가슴의 무거움, 목이 메는 느낌, 피곤한 눈, 느려진 몸.',
      explore: [
        '구체적으로 무엇을 잃어버린 것처럼 느껴지나요?',
        '지금 그저 곁에 있어주는 것만으로 도움이 될 사람이나 무언가는 누구인가요?',
        '오늘, 주의를 돌리는 것이 아니라 진짜 위로는 어떤 모습일까요?',
      ],
    },
    insecurity: {
      label: '불안정감',
      notice: '자신의 선택을 계속 의심하기, 다른 사람과 비교하기, 누구보다 먼저 흠을 찾아내는 목소리.',
      hear: '불안정감은 "넌 부족해" 또는 "들킬 거야"라고 말해요. 종종 소속되지 못할 것 같은 오래된 두려움이 자기비판의 옷을 입은 거예요.',
      feel: '속이 가라앉는 느낌, 움츠러든 자세, 얼굴의 화끈거림 (수치심과 사촌 관계).',
      explore: [
        '이 비판은 실제로 누구의 목소리처럼 들리나요?',
        '똑같이 느끼는 친구에게는 뭐라고 말해줄 건가요?',
        '그 의심에 반박할 만한 진짜 증거 하나는 무엇인가요?',
      ],
    },
    loneliness: {
      label: '외로움',
      notice: '사람들 곁에 있어도 느껴지는 조용한 아픔, 더 고립되고 싶은 끌림, 보이지 않거나 닿을 수 없다는 느낌.',
      hear: '외로움은 "아무도 진짜로 이해하지 못해" 또는 "나 혼자야"라고 말해요. 이는 연결이 없다는 증거가 아니라 연결이 부족하다는 신호예요.',
      feel: '가슴의 공허함, 낮은 에너지, 조용한 순간에 내려앉는 무거움.',
      explore: [
        '오늘 잠깐이라도 연락할 수 있는 한 사람은 누구인가요?',
        '마지막으로 진심으로 이해받는다고 느낀 건 언제였고, 무엇이 그걸 가능하게 했나요?',
        '이 외로움은 혼자라는 것에 관한 것인가요, 아니면 보이지 않는다는 느낌에 관한 것인가요?',
      ],
    },
    overwhelm: {
      label: '압도됨',
      notice: '한꺼번에 몰려드는 많은 일들, 어디서부터 시작해야 할지 결정하기 어려움, 명확한 사고 대신 흐릿하거나 얼어붙은 느낌.',
      hear: '압도됨은 "할 일은 너무 많고 나는 너무 적어"라고 말해요. 감당할 수 없다는 게 아니라, 너무 많은 것들이 동시에 관심을 요구하고 있다는 뜻이에요.',
      feel: '답답한 가슴, 얕은 호흡, 머릿속의 웅웅거리거나 흩어지는 느낌, 안절부절못함 또는 얼어붙음.',
      explore: [
        '오늘 딱 한 가지만 할 수 있다면, 실제로 가장 중요한 건 무엇일까요?',
        '미루거나, 그만두거나, 넘겨줄 수 있는 일은 무엇인가요?',
        '완벽하지 않게라도 이 일을 하는 게 아예 안 하는 것보다 어떤 느낌일까요?',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH — Latin America  (Español latinoamericano)
// ─────────────────────────────────────────────────────────────────────────────

export const es: Translations = {
  tabs: {
    home:     'Inicio',
    breathe:  'Respirar',
    journal:  'Diario',
    today:    'Hoy',
    emotions: 'Emociones',
    insights: 'Análisis',
    settings: 'Ajustes',
  },

  moods: [
    { emoji: '😔', label: 'Difícil',  value: 1, color: '#E8B4BC' },
    { emoji: '😕', label: 'Bajo',     value: 2, color: '#F2C4A0' },
    { emoji: '😐', label: 'Regular',  value: 3, color: '#F5E6A0' },
    { emoji: '🙂', label: 'Bien',     value: 4, color: '#B8DBC0' },
    { emoji: '😄', label: 'Genial',   value: 5, color: '#A0C4D0' },
  ],

  install: {
    title:      'Agregar a la pantalla de inicio',
    bodyIos:    "Toca el botón Compartir (⬆) en Safari y elige 'Agregar a pantalla de inicio'.",
    bodyOther:  'Instala Clarity in Calm para acceso inmediato — sin tienda de aplicaciones.',
    installBtn: 'Instalar app',
    dismiss:    'Ahora no',
  },

  onboarding: {
    slides: [
      {
        emoji: '🌿',
        title: 'Bienvenido/a a\nClarity in Calm',
        body: 'Un espacio tranquilo para escribir, rastrear emociones y conocerte mejor — todo guardado de forma privada en este dispositivo.',
      },
      {
        emoji: '🗓️',
        title: 'Tu panel del día',
        body: 'La pestaña Hoy muestra tu racha y entradas recientes, con accesos directos para registrar cómo te sientes.',
      },
      {
        emoji: '📖',
        title: 'Tu diario, a tu manera',
        body: 'Elige entre 6 plantillas — escritura libre, gratitud, reencuadre, carta a tu yo futuro y más. Agrega etiquetas y busca entradas pasadas.',
      },
      {
        emoji: '🏷️',
        title: 'Nombra lo que sientes',
        body: 'Toca una de las 7 emociones básicas, o escribe la tuya. Añade intensidad y etiquetas de contexto para entender qué impulsa cómo te sientes.',
      },
      {
        emoji: '📊',
        title: 'Descubre tus patrones',
        body: 'La pestaña Perspectivas muestra tendencias de humor, emociones principales y tu racha — una imagen más clara de tu mundo interior.',
      },
      {
        emoji: '⚙️',
        title: 'Hazlo tuyo',
        body: 'La pestaña Ajustes te permite configurar recordatorios, cambiar el idioma, ajustar el tema y gestionar tus datos — todo en un solo lugar.',
      },
      {
        emoji: '🛡️',
        title: 'Diseñado para protegerte',
        body: 'Así es exactamente como mantenemos seguras tus entradas.',
      },
    ],
    next:       'Siguiente',
    getStarted: '¡Vamos!',
    privacy:    '🔒 Tus datos nunca abandonan tu dispositivo',
    reportIssue: 'Reportar un problema',
    shieldChecklist: [
      'Las entradas se cifran en tu dispositivo',
      'Nunca se suben a ningún servidor',
      'Sin anuncios, rastreadores ni análisis sobre el contenido de tu diario',
      'Puedes exportar o eliminar todo, en cualquier momento',
    ],
    replayOnboarding: 'Ver la introducción de nuevo',
    languageStepTitle: 'Elige tu idioma',
    languageStepBody: 'Selecciona el idioma que te gustaría usar.',
    pillTip: '💡 Consejo: puedes cambiar de idioma en cualquier momento con la píldora en la esquina superior izquierda.',
    continueLabel: 'Continuar',
  },

  home: {
    greeting: {
      morning:   'Buenos días',
      afternoon: 'Buenas tardes',
      evening:   'Buenas noches',
    },
    greetingEmoji: '🌿',
    moodPrompt:    '¿Cómo te sientes?',
    moodToday:     '✅  Estado de hoy',
    startSession:  'Iniciar una sesión',
    actions: {
      breatheTitle: 'Respirar',
      breatheSub:   'Respiración caja · 4 min',
      journalTitle: 'Diario',
      journalSub:   'Reflexionar y registrar',
      groundTitle:  'Enraizar',
      groundSub:    '5-4-3-2-1 · Vuelve al presente',
    },
    progress: {
      title:    'Tu progreso',
      streak:   'días seguidos',
      entries:  'registros',
      sessions: 'sesiones',
    },
    streakHow:    'Registra una entrada en el diario cada día para aumentar tu racha',
    helpBtn:        '¿No sabes por dónde empezar?',
    moodUpdateHint: 'Toca un estado de ánimo para actualizar',
    todayEntries:   'Registros de hoy',
    moreEntries:    'más — abre el Diario para ver todo',
    gettingStarted: {
      title: '¿Por dónde empezar?',
      steps: [
        { emoji: '🌬️', label: 'Respirar',  sub: 'Abre la pestaña Respirar para una sesión calmante de 4 minutos' },
        { emoji: '📖', label: 'Diario',    sub: 'Registra tu estado de ánimo y pensamientos en la pestaña Diario' },
        { emoji: '✨', label: 'Progreso',  sub: 'Ve tus patrones después de tu primera entrada en el diario' },
      ],
    },
  },

  breathe: {
    title:    'Respirar',
    subtitle: 'Respiración caja · 4 – 4 – 4 – 4',
    phases: {
      inhale: { label: 'Inhalar',   hint: 'respira profundo'   },
      hold1:  { label: 'Sostener',  hint: 'mantén suavemente'  },
      exhale: { label: 'Exhalar',   hint: 'suelta el aire'     },
      rest:   { label: 'Descansar', hint: 'deja que se asiente' },
    },
    ready:          'Listo',
    tapToStart:     'toca Iniciar para comenzar',
    naturalBreath:  'ponte cómodo y respira naturalmente',
    followCircle:   'El círculo guía cada respiración — obsérvalo y respira en sincronía.',
    round:          'Ronda',
    endSession:     'Terminar sesión',
    startBreathing: 'Iniciar respiración',
    infoText:
      'La respiración de caja activa tu sistema nervioso parasimpático, reduciendo el estrés y mejorando la concentración. Cada fase dura 4 segundos.',
  },

  ground: {
    title:    'Enraizamiento',
    subtitle: '5 – 4 – 3 – 2 – 1  ·  Regresa al presente',
    intro:    'La ansiedad te aleja del momento presente. Este ejercicio de 2 minutos te devuelve activando tus sentidos uno a uno.',
    steps: [
      { count: 5, emoji: '👁️',  sense: 'Ver',      instruction: 'Nombra 5 cosas que puedas VER',            tip: 'Mira lentamente — una pared, tu mano, una ventana, un color, una sombra…' },
      { count: 4, emoji: '🤲',  sense: 'Sentir',   instruction: 'Nombra 4 cosas que puedas TOCAR o SENTIR', tip: 'La ropa en tu piel, el suelo bajo tus pies, la silla, la temperatura del aire…' },
      { count: 3, emoji: '👂',  sense: 'Escuchar', instruction: 'Nombra 3 sonidos que puedas ESCUCHAR',     tip: 'Tu respiración, el tráfico, un ventilador, pájaros, el silencio…' },
      { count: 2, emoji: '👃',  sense: 'Oler',     instruction: 'Nombra 2 cosas que puedas OLER',           tip: 'Tu bebida, el aire, jabón, comida cercana — o toma una respiración lenta…' },
      { count: 1, emoji: '👅',  sense: 'Saborear', instruction: 'Nombra 1 cosa que puedas SABOREAR',        tip: 'Agua, chicle, comida — o simplemente nota el sabor en tu boca ahora mismo…' },
    ] as const,
    next:  'Siguiente',
    done:  'Listo',
    complete: {
      emoji: '🌿',
      title: 'Estás presente',
      body:  'Tu sistema nervioso ha vuelto al momento presente. Respira hondo una vez y lleva esta calma contigo.',
      again: 'Repetir',
      back:  'Volver al inicio',
    },
    infoText: 'La técnica 5-4-3-2-1 interrumpe las espirales de ansiedad activando tus sentidos. Utilizada por terapeutas en todo el mundo — y no cuesta nada.',
  },

  journal: {
    title:    'Diario',
    subtitle: '¿Cómo te sientes ahora mismo?',

    safeSpace: {
      title: 'Este es tu espacio privado',
      body:  'Nadie más puede ver lo que escribes aquí — ni nosotros ni nadie. Di exactamente lo que tienes en mente, sin filtros. No hay forma incorrecta de sentir.',
    },

    moodLabel:       'Estado de ánimo',
    reflectionLabel: 'Reflexión',
    optionalLabel:   '(opcional)',
    placeholder:     'Escribe libremente…',

    prompts: [
      '¿Qué te hizo sonreír hoy?',
      'Una cosa por la que estás agradecido/a ahora…',
      '¿Qué se sintió pesado hoy?',
      'Un pequeño logro que vale la pena celebrar…',
      '¿Cómo se siente tu cuerpo ahora mismo?',
    ],

    saveBtn:   'Guardar entrada',
    savedBtn:  '✓  ¡Guardado!',
    pastTitle: 'Entradas anteriores',

    emptyTitle: 'Tus entradas aparecerán aquí. Comienza registrando cómo te sientes hoy.',

    crisis: {
      title: 'No estás solo/a',
      body:
        'Parece que estás pasando por algo muy difícil ahora mismo. Escribirlo ya es un acto de valentía.\n\nSi tienes pensamientos de suicidio o autolesión, por favor comunícate — alguien está listo para escucharte ahora mismo.',
      lines: [
        {
          emoji:  '📞',
          title:  'Línea de la Vida (México)',
          sub:    '800 911 2000 · Gratuito, 24/7',
          action: 'tel:8009112000',
        },
        {
          emoji:  '💬',
          title:  'SAPTEL (México)',
          sub:    '55 5259-8121 · Gratuito, 24/7',
          action: 'tel:5552598121',
        },
        {
          emoji:  '📞',
          title:  'Línea 192, opción 4 (Colombia)',
          sub:    '192, opción 4 · Gratuito, 24/7',
          action: 'tel:192,4',
        },
        {
          emoji:  '📞',
          title:  'Línea Nacional de Salud Mental (Argentina)',
          sub:    '0800-999-0091 · Gratuito, 24/7',
          action: 'tel:08009990091',
        },
        {
          emoji:  '📞',
          title:  'Línea 113, opción 5 (Perú)',
          sub:    '113, opción 5 · Gratuito, 24/7',
          action: 'tel:113,5',
        },
        {
          emoji:  '🌍',
          title:  'Líneas de ayuda internacionales',
          sub:    'findahelpline.com · Recursos en todo el mundo',
          action: 'https://findahelpline.com',
        },
      ],
      confirmBtn: 'Buscaré ayuda',
      saveBtn:    'Guardar mi entrada de todas formas',
    },

    crisisKeywords: {
      suicidalIdeation: ['suicidio', 'suicida', 'matarme', 'terminar con mi vida', 'quitarme la vida', 'quiero morir'],
      hopelessness: [
        'no quiero vivir', 'sin razón para vivir', 'mejor muerto', 'mejor muerta',
        'mejor sin mí', 'no vale la pena vivir',
      ],
      givingUp: ['no puedo más', 'acabar con todo', 'desaparecer para siempre'],
      selfHarm: ['hacerme daño', 'autolesión', 'autolesionarme', 'cortarme'],
      overdose: ['sobredosis'],
    },

    deleteConfirm: {
      title:   '¿Eliminar entrada?',
      body:    'Esta entrada se eliminará de forma permanente.',
      confirm: 'Eliminar',
      cancel:  'Cancelar',
    },
  },

  today: { title: 'Hoy', checkIn: '¿Cómo te sientes ahora?', logEmotion: 'Registrar emoción', streakDays: 'días seguidos', streakStart: 'Registra una emoción hoy para comenzar tu racha', tools: 'Herramientas rápidas', breatheTitle: 'Respiración de caja', breatheSub: '4-4-4-4 · Calma tu sistema nervioso', groundTitle: 'Enraizamiento 5-4-3-2-1', groundSub: 'Ancla al momento presente', todayEmotions: 'Emociones de hoy', noEmotionsYet: 'No has registrado emociones hoy', quote: 'Reflexión diaria', journalEntries: 'entradas\nde diario', emotionsLogged: 'emociones\nregistradas' },
  feelingsLibraryScreen: { title: 'Biblioteca de Emociones', subtitle: 'Nótalo, escúchalo, calma', cardTitle: 'Biblioteca de Emociones', cardSub: 'Explora 8 emociones comunes', back: 'Atrás', noticeLabel: 'Notar', hearLabel: 'Escuchar', feelLabel: 'Sentir', easeLabel: 'Calmar', exploreLabel: 'Explorar', affirmationLabel: 'Según cómo te sientes' },
  emotionsScreen: { title: 'Emociones', subtitle: '¿Qué sientes ahora?', selectEmotion: 'Toca lo que estás sintiendo', intensity: 'Intensidad', intensityLow: 'leve', intensityHigh: 'intensa', contextTags: '¿Qué está pasando?', bodyCheckIn: '¿Dónde lo sientes?', copingActions: '¿Qué hiciste?', note: 'Añadir nota (opcional)', notePlaceholder: 'Pensamientos sobre este sentimiento…', saveBtn: 'Registrar emoción', savedBtn: '✓ ¡Registrado!', pastTitle: 'Emociones recientes', emptyTitle: 'Tus registros aparecerán aquí', emptyBody: 'Toca una emoción arriba para registrar la primera', otherPill: '+ Otra', customPlaceholder: 'Escribe cómo te sientes…', quickLog: 'Registro rápido', fullLog: 'Registro completo', selectedEmotion: 'Seleccionado', deleteConfirm: { title: '¿Eliminar registro?', body: 'Este registro se eliminará de forma permanente.', confirm: 'Eliminar', cancel: 'Cancelar' } },
  insightsScreen: { title: 'Análisis', subtitle: 'Tus patrones en el tiempo', monthlyReport: 'Este mes', totalEntries: 'entradas de diario', totalEmotions: 'emociones registradas', avgIntensity: 'intensidad promedio', topEmotion: 'Más sentida', topTrigger: 'Principal desencadenante', streakRecord: 'Mejor racha', timeOfDay: 'Momento del día', morning: 'Mañana', afternoon: 'Tarde', evening: 'Noche', night: 'Madrugada', triggers: 'Desencadenantes', noTriggers: 'Registra emociones con etiquetas para ver desencadenantes', moodCalendar: 'Calendario de ánimo', weeklyReview: 'Revisión semanal', weeklyReviewPrompt: 'Es domingo — hora de reflexionar sobre tu semana', weeklyReviewBtn: 'Comenzar revisión', exportTitle: 'Exportar datos', exportBtn: 'Exportar como JSON', exportSuccess: '¡Guardado!', empty: { title: 'Tus insights se construirán aquí', body: 'Registra algunas emociones y entradas para ver patrones.' }, last7: 'Últimos 7 días', chartLegend: 'Cada punto muestra tu ánimo promedio ese día', moodBreakdown: 'Distribución de ánimo', streakMotiv: { week: '¡Increíble! ¡Una semana! 🌟', days: 'días seguidos', sub: 'Estás creando un hábito de autocuidado.' }, insights: { title: 'Perspectivas', topMood: 'Ánimo más registrado', trend: { label: 'Tendencia', up: '↑ Mejorando vs semana anterior', down: '↓ Bajando vs semana anterior', flat: '→ Estable vs semana anterior', none: 'Registra más para ver tendencias' }, bestDay: 'Tu mejor día', noPattern: 'Sigue registrando para descubrir patrones' } },
  settingsScreen: { title: 'Ajustes', notifications: 'Recordatorio diario', notificationsOff: 'Apagado', notificationsOn: 'Encendido', reminderTime: 'Hora del recordatorio', reminderDays: 'Días', appearance: 'Apariencia', themeSystem: 'Sistema', themeLight: 'Claro', themeDark: 'Oscuro', language: 'Idioma', data: 'Tus datos', exportData: 'Exportar todos los datos (JSON)', shareClarityAI: 'Compartir datos con ClarityAI', deleteData: 'Eliminar todos los datos', deleteConfirm: { title: '¿Eliminar todos los datos?', body: 'Esto borrará permanentemente todas las entradas, emociones y ajustes.', confirm: 'Eliminar todo', cancel: 'Cancelar' }, timePicker: { title: 'Hora del recordatorio', hourLabel: 'Hora', minuteLabel: 'Min', confirm: 'Guardar recordatorio', cancel: 'Cancelar' }, notifPermission: { title: 'Se requiere permiso', body: 'Activa las notificaciones en la configuración de tu dispositivo para recibir recordatorios diarios.' }, dataDeleted: { title: 'Listo', body: 'Todos los datos han sido eliminados.' }, exportSaved: { title: 'Exportado', bodyPrefix: 'Guardado en: ' }, exportFailed: { title: 'Error al exportar', fallbackBody: 'Algo salió mal.' }, privacy: 'Política de privacidad', youtube: 'Ver en YouTube', version: 'Versión', daysShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'], about: 'Acerca de', aboutBody: 'Clarity in Calm es una app de bienestar privada y sin conexión. Todos los datos se cifran en tu dispositivo.', account: { header: 'Cuenta', subtitle: 'Inicia sesión para sincronizar y respaldar tus datos.', signIn: 'Iniciar sesión / Crear cuenta', signOut: 'Cerrar sesión', deleteAccount: 'Eliminar cuenta', deleteConfirm: { title: '¿Eliminar cuenta?', body: 'Esto elimina permanentemente tu cuenta y no se puede deshacer.', confirm: 'Eliminar', cancel: 'Cancelar' }, deleteError: { title: 'No se pudo eliminar la cuenta', body: 'Inténtalo de nuevo.' } } },
  authScreen: { signIn: { title: 'Bienvenido de nuevo', subtitle: 'Inicia sesión en Clarity in Calm.', emailLabel: 'Correo electrónico', emailPlaceholder: 'email@example.com', passwordLabel: 'Contraseña', passwordPlaceholder: '••••••••', forgotPassword: '¿Olvidaste tu contraseña?', submit: 'Iniciar sesión', or: 'o', continueWithGoogle: 'Continuar con Google', noAccountPrefix: '¿No tienes una cuenta? ', signUpLink: 'Regístrate', errors: { missingCredentials: 'Ingresa tu correo y contraseña', generic: 'No se pudo iniciar sesión. Inténtalo de nuevo.', google: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.' } }, signUp: { title: 'Crea tu cuenta', subtitle: 'Regístrate para empezar a usar Clarity in Calm.', emailLabel: 'Correo electrónico', emailPlaceholder: 'email@example.com', passwordLabel: 'Contraseña', passwordPlaceholder: 'Al menos 8 caracteres', consentPrefix: 'Acepto la ', consentLink: 'Política de Privacidad', submit: 'Registrarme', hasAccountPrefix: '¿Ya tienes una cuenta? ', signInLink: 'Inicia sesión', confirmEmailNotice: 'Revisa tu correo para confirmar tu cuenta', errors: { missing: 'Ingresa un correo y una contraseña', passwordTooShort: 'La contraseña debe tener al menos 8 caracteres', consentRequired: 'Acepta la Política de Privacidad para continuar', generic: 'No se pudo crear la cuenta. Inténtalo de nuevo.' } }, forgotPassword: { title: 'Restablece tu contraseña', subtitle: 'Te enviaremos un enlace para restablecer tu contraseña.', emailLabel: 'Correo electrónico', emailPlaceholder: 'email@example.com', submit: 'Enviar enlace', sentBodyPrefix: 'Si existe una cuenta para ', sentBodySuffix: ', te hemos enviado un enlace para restablecer tu contraseña.', backToSignIn: 'Volver a iniciar sesión', cancel: 'Cancelar', errors: { missingEmail: 'Ingresa tu correo electrónico', generic: 'No se pudo enviar el correo de restablecimiento. Inténtalo de nuevo.' } }, resetPassword: { title: 'Configura una nueva contraseña', passwordLabel: 'Nueva contraseña', passwordPlaceholder: 'Al menos 8 caracteres', submit: 'Actualizar contraseña', errors: { expiredLink: 'Este enlace ha expirado. Solicita uno nuevo.', passwordTooShort: 'La contraseña debe tener al menos 8 caracteres', generic: 'No se pudo actualizar la contraseña. Inténtalo de nuevo.' } }, oauth: { googleGenericError: 'No se pudo iniciar el proceso de Google', appleNoToken: 'El inicio de sesión con Apple no devolvió un token de identidad', appleGenericError: 'No se pudo iniciar sesión con Apple. Inténtalo de nuevo.' } },
  journalExtended: { searchPlaceholder: 'Buscar entradas…', templates: 'Plantillas', tags: 'Etiquetas', addTag: '+ Agregar etiqueta', calendar: 'Calendario', futureSelf: 'Yo futuro', futureSelfTitle: 'Escribir a tu yo futuro', futureSelfSubtitle: 'Elige una fecha para abrir esta carta', futureSelfLocked: 'Se abre el', futureSelfUnlock: 'Abrir carta', unlockDate: 'Fecha de apertura', setDate: 'Establecer fecha', templateFreeWrite: 'Escritura libre', templateGratitude: 'Gratitud', templateReflection: 'Reflexión diaria', templateCBT: 'Revisión de pensamientos', templateWeeklyReview: 'Revisión semanal', templateFutureSelf: 'Yo futuro', templatePrompts: { gratitude: ['1. Estoy agradecido/a por...', '2. Algo pequeño que me hizo sonreír...', '3. Una persona que aprecio y por qué...'], reflection: ['¿Qué me agotó hoy?', '¿Qué me dio energía hoy?', '¿Qué haría diferente mañana?'], cbt: ['El pensamiento que sigo teniendo:', 'Evidencia que respalda este pensamiento:', 'Evidencia en contra de este pensamiento:', 'Una forma más equilibrada de verlo:'], 'weekly-review': ['¿Qué me agotó esta semana?', '¿Qué me dio energía esta semana?', 'Un logro del que estoy orgulloso/a:', 'Una intención para la próxima semana:'], 'future-self': ['Querido yo futuro,', 'Ahora mismo me siento...', 'Algo que espero que recuerdes:', 'Un mensaje de aliento:'] }, noResults: 'Sin resultados para tu búsqueda', customTagPlaceholder: 'etiqueta…', addTagConfirm: 'Agregar', deleteEntry: 'Eliminar', tagLabels: { work: 'trabajo', home: 'hogar', family: 'familia', health: 'salud', relationship: 'relación', growth: 'crecimiento', gratitude: 'gratitud', stress: 'estrés', joy: 'alegría', sleep: 'sueño' } },
  dailyContent: {
    quotes: [
      { text: 'Respira. Es solo un mal día, no una mala vida.', author: 'Anónimo' },
      { text: 'No tienes que controlar tus pensamientos. Solo tienes que dejar de permitir que ellos te controlen a ti.', author: 'Dan Millman' },
      { text: 'Casi todo vuelve a funcionar si lo desconectas unos minutos, incluida tú misma.', author: 'Anne Lamott' },
      { text: 'La paz viene de adentro. No la busques afuera.', author: 'Buda' },
      { text: 'Eres suficiente. Siempre lo has sido.', author: 'Anónimo' },
      { text: 'Dentro de ti hay una quietud y un santuario al que puedes retirarte en cualquier momento.', author: 'Hermann Hesse' },
      { text: 'El momento presente es el único tiempo sobre el que tenemos dominio.', author: 'Thich Nhat Hanh' },
      { text: 'Respira. Suelta. Y recuérdate que este mismo instante es el único que sabes con certeza que tienes.', author: 'Oprah Winfrey' },
      { text: 'El autocuidado no es autocomplacencia. Es autopreservación.', author: 'Audre Lorde' },
      { text: 'En medio de la dificultad reside la oportunidad.', author: 'Albert Einstein' },
      { text: 'La felicidad no es algo ya hecho. Proviene de tus propias acciones.', author: 'Dalái Lama' },
      { text: 'Cuidarte a ti misma no es egoísmo, es esencial.', author: 'Anónimo' },
      { text: 'No tienes que ser positiva todo el tiempo. Está perfectamente bien sentirte triste, enojada, molesta o ansiosa.', author: 'Lori Deschene' },
      { text: 'Empieza donde estás. Usa lo que tienes. Haz lo que puedas.', author: 'Arthur Ashe' },
      { text: 'Incluso la noche más oscura terminará y el sol saldrá.', author: 'Víctor Hugo' },
    ],
    feelingsEase: {
      anger: 'Está bien sentir enojo sin actuar según cada impulso que te da. Dale primero un cuerpo — una caminata, unas cuantas exhalaciones fuertes — antes de ponerle palabras.',
      anxiousness: "No tienes que resolver cada 'y si' esta noche. Nombrar una sola cosa que puedes controlar ahora mismo suele bastar para aflojar el bucle.",
      burnout: 'El descanso no es algo que te ganas después de terminar todo — es lo que hace posible terminar cualquier cosa. Una cosa puede esperar.',
      fear: 'Nombrar el miedo en voz alta, aunque sea solo para ti misma, le quita algo de poder. Pregúntate qué está pasando realmente ahora mismo, en este lugar, frente a lo que tu mente está prediciendo.',
      sadness: 'La tristeza no necesita arreglarse de inmediato — necesita espacio. Permítete sentirla unos minutos sin apurarte a sentirte mejor.',
      insecurity: 'La voz que duda de ti no es un juez neutral — es un viejo hábito de pensamiento asustado. Tienes permiso para no estar de acuerdo con ella.',
      loneliness: 'La soledad disminuye con incluso un pequeño contacto real — un mensaje, una llamada, sentarte en algún lugar rodeada de gente. No necesita resolverse de una sola vez.',
      overwhelm: 'No tienes que sostenerlo todo a la vez. Elige el paso siguiente más pequeño y deja que el resto espere su turno.',
    },
  },

  emotionsCatalog: {
    basicEmotions: {
      happiness: 'Felicidad',
      sadness:   'Tristeza',
      fear:      'Miedo',
      disgust:   'Asco',
      anger:     'Enojo',
      contempt:  'Desprecio',
      surprise:  'Sorpresa',
    },
    copingActions: {
      breathing:  'Respiración profunda',
      journaling: 'Escribir en el diario',
      walk:       'Caminar/ejercicio',
      call:       'Llamé a alguien',
      rest:       'Descanso/dormir',
      music:      'Música',
      meditation: 'Meditación',
      water:      'Beber agua',
      grounding:  '5-4-3-2-1',
      nothing:    'Nada todavía',
    },
     bodyRegions: {
  head:      'Cabeza',
  throat:    'Garganta',
  chest:     'Pecho',
  stomach:   'Estómago',
  shoulders: 'Hombros',
  arms:      'Brazos',
  legs:      'Piernas',
  hands:     'Manos',
},
  },

  feelingsLibraryContent: {
    anger: {
      label: 'Enojo',
      notice: 'Un fusible corto, mandíbula apretada, reaccionar bruscamente ante cosas que normalmente no te molestarían. Suele llegar rápido y quiere ser actuado de inmediato.',
      hear: 'El enojo suele decir "esto no es justo" o "tengo que arreglar esto ahora mismo". Está protegiendo un límite que fue cruzado, aunque el objetivo de tu enojo no sea la causa real.',
      feel: 'Calor en el pecho y la cara, puños o mandíbula apretados, pulso acelerado, un impulso de moverte o hablar con brusquedad.',
      explore: [
        '¿Qué límite sientes que fue cruzado ahora mismo — y es realmente este momento, o algo más antiguo?',
        'Si dijeras la versión honesta de lo que estás pensando, ¿cuál sería?',
        '¿Cómo se vería realmente "resuelto" dentro de un día?',
      ],
    },
    anxiousness: {
      label: 'Ansiedad',
      notice: 'Pensamientos acelerados que saltan entre los peores escenarios, inquietud, revisar las cosas una y otra vez, dificultad para concentrarte en una sola tarea.',
      hear: 'La ansiedad tiende a decir "y si" en bucle. Está tratando de prepararte para el peligro ensayando cada versión posible de antemano.',
      feel: 'Un estómago revuelto o tenso, respiración superficial, una sensación nerviosa o acelerada en las extremidades.',
      explore: [
        '¿Qué parte de esta preocupación está realmente bajo tu control hoy?',
        '¿Cuál es la historia que tu mente te está contando, y qué evidencia la respalda realmente?',
        '¿Qué te ha ayudado a superar la incertidumbre antes?',
      ],
    },
    burnout: {
      label: 'Agotamiento',
      notice: 'Una sensación de vacío donde antes había impulso, arrastrarte por tareas que normalmente manejas con facilidad, la sensación de que ni siquiera el descanso te recarga.',
      hear: 'El agotamiento dice "debería poder seguir adelante" mucho después de que el tanque está vacío. Confunde el cansancio con un defecto de carácter en lugar de una señal.',
      feel: 'Pesadez en las extremidades, pensamiento nublado, un dolor sordo detrás de los ojos, poca motivación incluso para cosas que disfrutas.',
      explore: [
        '¿Qué se ha vuelto silenciosamente innegociable pero en realidad podría renegociarse?',
        '¿Cuándo fue la última vez que te sentiste como tú misma, y qué fue diferente ese día?',
        'Si te dieras permiso para hacer menos esta semana, ¿qué soltarías primero?',
      ],
    },
    fear: {
      label: 'Miedo',
      notice: 'Una alerta repentina, querer evitar o escapar de una situación específica, una mente que sigue volviendo a la amenaza.',
      hear: 'El miedo dice "esto podría hacerme daño" y estrecha tu enfoque hacia el peligro. Es un sistema antiguo y rápido que trata de mantenerte a salvo, incluso cuando la amenaza es más incierta que física.',
      feel: 'Un sobresalto en el pecho, manos frías, la respiración contenida, músculos listos para moverse.',
      explore: [
        '¿Qué específicamente temes que suceda, en términos concretos?',
        '¿Este miedo ha acertado antes, o tiende a sobreestimar el peligro?',
        '¿Cuál sería un pequeño paso hacia lo que estás evitando?',
      ],
    },
    sadness: {
      label: 'Tristeza',
      notice: 'Poca energía, ganas de llorar, querer retraerte o quedarte en silencio, cosas que antes se sentían ligeras ahora se sienten pesadas.',
      hear: 'La tristeza dice "algo importaba y se está yendo, o ya se fue". Es la respuesta natural a la pérdida, incluso una pérdida difícil de nombrar.',
      feel: 'Pesadez en el pecho, un nudo en la garganta, ojos cansados, un cuerpo más lento.',
      explore: [
        '¿Qué, específicamente, sientes que se ha perdido?',
        '¿Quién o qué te ayudaría con solo estar cerca en este momento?',
        '¿Cómo se vería el consuelo — no la distracción — hoy?',
      ],
    },
    insecurity: {
      label: 'Inseguridad',
      notice: 'Dudar constantemente de tus decisiones, compararte con otros, una voz que encuentra fallas antes que nadie más.',
      hear: 'La inseguridad dice "no eres suficiente" o "se van a dar cuenta". A menudo es un viejo miedo a no pertenecer, disfrazado de autocrítica.',
      feel: 'Una sensación de hundimiento en el estómago, postura encogida, calor en la cara (prima cercana de la vergüenza).',
      explore: [
        '¿A quién se parece realmente esta crítica?',
        '¿Qué le dirías a una amiga que se sintiera exactamente así?',
        '¿Cuál es una prueba real que contradice la duda?',
      ],
    },
    loneliness: {
      label: 'Soledad',
      notice: 'Un dolor silencioso incluso rodeada de otras personas, un impulso de aislarte aún más, sentirte invisible o inalcanzable.',
      hear: 'La soledad dice "nadie realmente lo entiende" o "estoy sola en esto". Es una señal de que falta conexión, no una prueba de que no está disponible.',
      feel: 'Una sensación de vacío en el pecho, poca energía, una pesadez que se instala en los momentos de silencio.',
      explore: [
        '¿A quién podrías contactar hoy, aunque sea brevemente?',
        '¿Cuándo fue la última vez que te sentiste verdaderamente comprendida, y qué lo hizo posible?',
        '¿Esta soledad es sobre estar sola, o sobre sentirte invisible?',
      ],
    },
    overwhelm: {
      label: 'Agobio',
      notice: 'Demasiadas cosas tirando de ti a la vez, dificultad para decidir por dónde empezar, una sensación de niebla o bloqueo en lugar de pensar con claridad.',
      hear: 'El agobio dice "hay demasiado y no hay suficiente de mí". No es que no puedas con las cosas — es que demasiadas cosas están pidiendo atención al mismo tiempo.',
      feel: 'Pecho apretado, respiración superficial, una sensación de zumbido o dispersión en la cabeza, inquietud o congelamiento.',
      explore: [
        'Si solo pudieras hacer una cosa hoy, ¿qué es lo que realmente importaría más?',
        '¿Qué hay en tu plato que podría postergarse, dejarse o delegarse?',
        '¿Cómo se sentiría hacer esto de forma imperfecta en lugar de no hacerlo en absoluto?',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HINDI  (हिन्दी)
// ─────────────────────────────────────────────────────────────────────────────

export const hi: Translations = {
  tabs: {
    home:     'होम',
    breathe:  'साँस',
    journal:  'डायरी',
    today:    'आज',
    emotions: 'भावनाएँ',
    insights: 'विश्लेषण',
    settings: 'सेटिंग',
  },

  moods: [
    { emoji: '😔', label: 'मुश्किल',  value: 1, color: '#E8B4BC' },
    { emoji: '😕', label: 'उदास',     value: 2, color: '#F2C4A0' },
    { emoji: '😐', label: 'ठीक है',   value: 3, color: '#F5E6A0' },
    { emoji: '🙂', label: 'अच्छा',    value: 4, color: '#B8DBC0' },
    { emoji: '😄', label: 'शानदार',   value: 5, color: '#A0C4D0' },
  ],

  install: {
    title:      'होम स्क्रीन पर जोड़ें',
    bodyIos:    "Safari में नीचे Share बटन (⬆) टैप करें, फिर 'Add to Home Screen' चुनें।",
    bodyOther:  'Clarity in Calm इंस्टॉल करें — ऐप स्टोर की ज़रूरत नहीं, सीधे एक्सेस करें।',
    installBtn: 'ऐप इंस्टॉल करें',
    dismiss:    'अभी नहीं',
  },

  onboarding: {
    slides: [
      {
        emoji: '🌿',
        title: 'Clarity in Calm में\nस्वागत है',
        body: 'डायरी लिखने, भावनाएँ ट्रैक करने और खुद को समझने की एक शांत जगह — सब कुछ इस डिवाइस पर निजी रूप से संग्रहीत है।',
      },
      {
        emoji: '🗓️',
        title: 'आपका दैनिक डैशबोर्ड',
        body: 'आज का टैब आपकी स्ट्रीक और हाल की प्रविष्टियाँ दिखाता है, एक टैप में अपनी भावना दर्ज करें।',
      },
      {
        emoji: '📖',
        title: 'अपने तरीके से लिखें',
        body: '6 टेम्पलेट में से चुनें — स्वतंत्र लेखन, कृतज्ञता, पुनर्रचना, भविष्य के स्व को पत्र और अधिक। टैग जोड़ें और पुरानी प्रविष्टियाँ खोजें।',
      },
      {
        emoji: '🏷️',
        title: 'अपनी भावना को नाम दें',
        body: '7 मुख्य भावनाओं में से किसी एक को चुनें, या अपनी खुद की लिखें। तीव्रता और संदर्भ टैग जोड़ें ताकि समझ सकें कि आप ऐसा क्यों महसूस करते हैं।',
      },
      {
        emoji: '📊',
        title: 'अपने पैटर्न खोजें',
        body: 'इनसाइट्स टैब मूड रुझान, शीर्ष भावनाएँ और स्ट्रीक दिखाता है — आपकी आंतरिक दुनिया की स्पष्ट तस्वीर।',
      },
      {
        emoji: '⚙️',
        title: 'इसे अपने अनुसार बनाएं',
        body: 'सेटिंग्स टैब में आप रिमाइंडर सेट कर सकते हैं, भाषा बदल सकते हैं, थीम समायोजित कर सकते हैं, और अपना डेटा प्रबंधित कर सकते हैं — सब एक ही जगह।',
      },
      {
        emoji: '🛡️',
        title: 'आपकी सुरक्षा के लिए बनाया गया',
        body: 'यहाँ बताया गया है कि हम आपकी प्रविष्टियों को कैसे सुरक्षित रखते हैं।',
      },
    ],
    next:       'आगे',
    getStarted: 'चलते हैं',
    privacy:    '🔒 आपका डेटा कभी भी इस डिवाइस से बाहर नहीं जाता',
    reportIssue: 'समस्या रिपोर्ट करें',
    shieldChecklist: [
      'प्रविष्टियाँ आपके डिवाइस पर एन्क्रिप्ट की जाती हैं',
      'कुछ भी कभी किसी सर्वर पर अपलोड नहीं होता',
      'आपकी डायरी सामग्री पर कोई विज्ञापन, ट्रैकर या एनालिटिक्स नहीं',
      'आप कभी भी सब कुछ निर्यात या हटा सकते हैं',
    ],
    replayOnboarding: 'फिर से ऑनबोर्डिंग देखें',
    languageStepTitle: 'अपनी भाषा चुनें',
    languageStepBody: 'वह भाषा चुनें जिसका आप उपयोग करना चाहते हैं।',
    pillTip: '💡 सुझाव: आप स्क्रीन के ऊपरी-बाएँ कोने में मौजूद पिल बटन से कभी भी भाषा बदल सकते हैं।',
    continueLabel: 'जारी रखें',
  },

  home: {
    greeting: {
      morning:   'शुभ प्रभात',
      afternoon: 'शुभ दोपहर',
      evening:   'शुभ संध्या',
    },
    greetingEmoji: '🌿',
    moodPrompt:    'आप कैसा महसूस कर रहे हैं?',
    moodToday:     '✅  आज का मूड',
    startSession:  'सत्र शुरू करें',
    actions: {
      breatheTitle: 'साँस लेना',
      breatheSub:   'बॉक्स ब्रीदिंग · 4 मिनट',
      journalTitle: 'डायरी',
      journalSub:   'भावनाएँ लिखें',
      groundTitle:  'ग्राउंड',
      groundSub:    '5-4-3-2-1 · अभी करें',
    },
    progress: {
      title:    'आपकी प्रगति',
      streak:   'दिन की स्ट्रीक',
      entries:  'प्रविष्टियाँ',
      sessions: 'सत्र',
    },
    streakHow:    'स्ट्रीक बढ़ाने के लिए हर दिन डायरी में प्रविष्टि करें',
    helpBtn:        'कहाँ जाएँ समझ नहीं आ रहा?',
    moodUpdateHint: 'अपडेट करने के लिए मूड टैप करें',
    todayEntries:   'आज की प्रविष्टियाँ',
    moreEntries:    'और — सभी देखने के लिए डायरी खोलें',
    gettingStarted: {
      title: 'शुरुआत कैसे करें',
      steps: [
        { emoji: '🌬️', label: 'साँस लेना', sub: '4 मिनट के शांत सत्र के लिए साँस टैब खोलें' },
        { emoji: '📖', label: 'डायरी',     sub: 'डायरी टैब में अपना मूड और विचार लिखें' },
        { emoji: '✨', label: 'प्रगति',     sub: 'पहली प्रविष्टि के बाद यहाँ अपने पैटर्न देखें' },
      ],
    },
  },

  breathe: {
    title:    'साँस लेना',
    subtitle: 'बॉक्स ब्रीदिंग · 4 – 4 – 4 – 4',
    phases: {
      inhale: { label: 'श्वास लें',  hint: 'धीरे-धीरे साँस लें'   },
      hold1:  { label: 'रोकें',      hint: 'हल्के से रोकें'        },
      exhale: { label: 'छोड़ें',     hint: 'धीरे-धीरे साँस छोड़ें' },
      rest:   { label: 'आराम',       hint: 'शांत होने दें'         },
    },
    ready:          'तैयार',
    tapToStart:     'शुरू करने के लिए Start दबाएँ',
    naturalBreath:  'आराम से बैठें और स्वाभाविक रूप से साँस लें',
    followCircle:   'वृत्त हर साँस का मार्गदर्शन करता है — इसे देखें और इसके साथ साँस लें।',
    round:          'राउंड',
    endSession:     'सत्र समाप्त करें',
    startBreathing: 'साँस लेना शुरू करें',
    infoText:
      'बॉक्स ब्रीदिंग आपके पैरासिम्पेथेटिक नर्वस सिस्टम को सक्रिय करती है, तनाव कम करती है और एकाग्रता बढ़ाती है। प्रत्येक चरण 4 सेकंड का है।',
  },

  ground: {
    title:    'ग्राउंडिंग',
    subtitle: '5 – 4 – 3 – 2 – 1  ·  अभी वापस आएँ',
    intro:    'चिंता आपको वर्तमान से दूर ले जाती है। यह 2 मिनट का अभ्यास आपकी इंद्रियों को एक-एक करके जगाकर आपको वापस लाता है।',
    steps: [
      { count: 5, emoji: '👁️',  sense: 'देखना',       instruction: '5 चीज़ें जो आप देख सकते हैं',              tip: 'धीरे-धीरे चारों ओर देखें — एक दीवार, आपका हाथ, खिड़की, कोई रंग, छाया…' },
      { count: 4, emoji: '🤲',  sense: 'महसूस करना',  instruction: '4 चीज़ें जो आप छू सकते हैं या महसूस कर सकते हैं', tip: 'कपड़ों का अहसास, पैरों तले फर्श, कुर्सी, हवा का तापमान…' },
      { count: 3, emoji: '👂',  sense: 'सुनना',        instruction: '3 आवाज़ें जो आप सुन सकते हैं',             tip: 'अपनी साँस, वाहनों की आवाज़, पंखा, पक्षी, खामोशी की गूँज…' },
      { count: 2, emoji: '👃',  sense: 'सूँघना',       instruction: '2 चीज़ें जो आप सूँघ सकते हैं',            tip: 'आपका पेय, हवा, साबुन, पास का खाना — या धीरे से साँस लें…' },
      { count: 1, emoji: '👅',  sense: 'स्वाद',        instruction: '1 चीज़ जो आप स्वाद में महसूस कर सकते हैं', tip: 'पानी, गम, खाना — या बस अभी मुँह के स्वाद पर ध्यान दें…' },
    ] as const,
    next:  'अगला',
    done:  'हो गया',
    complete: {
      emoji: '🌿',
      title: 'आप वर्तमान में हैं',
      body:  'आपका तंत्रिका तंत्र वर्तमान क्षण में वापस आ गया। एक धीमी साँस लें और यह शांति अपने साथ रखें।',
      again: 'फिर करें',
      back:  'होम पर वापस',
    },
    infoText: '5-4-3-2-1 तकनीक आपकी इंद्रियों को सक्रिय करके चिंता के चक्र को तोड़ती है। दुनिया भर के थेरेपिस्ट इसका उपयोग करते हैं — और इसके लिए कुछ भी चाहिए नहीं।',
  },

  journal: {
    title:    'डायरी',
    subtitle: 'अभी आप कैसा महसूस कर रहे हैं?',

    safeSpace: {
      title: 'यह आपका निजी स्थान है',
      body:  'यहाँ आप जो लिखते हैं वह कोई नहीं देख सकता — न हम, न कोई और। बिना किसी फ़िल्टर के अपने मन की बात लिखें। कोई भी भावना गलत नहीं है।',
    },

    moodLabel:       'मूड',
    reflectionLabel: 'विचार',
    optionalLabel:   '(वैकल्पिक)',
    placeholder:     'स्वतंत्र रूप से लिखें…',

    prompts: [
      'आज आपको किस बात ने मुस्कुराया?',
      'अभी एक चीज़ जिसके लिए आप आभारी हैं…',
      'आज क्या भारी लगा?',
      'एक छोटी सफलता जो मनाने लायक है…',
      'अभी आपका शरीर कैसा महसूस कर रहा है?',
    ],

    saveBtn:   'प्रविष्टि सहेजें',
    savedBtn:  '✓  सहेजा गया!',
    pastTitle: 'पिछली प्रविष्टियाँ',

    emptyTitle: 'आपकी प्रविष्टियाँ यहाँ दिखेंगी। आज अपनी भावनाएँ लिखकर शुरू करें।',

    crisis: {
      title: 'आप अकेले नहीं हैं',
      body:
        'ऐसा लगता है कि आप अभी कुछ बहुत भारी से गुज़र रहे हैं। यह लिखना साहस का काम है।\n\nअगर आपके मन में आत्महत्या या खुद को नुकसान पहुँचाने के विचार आ रहे हैं, तो कृपया संपर्क करें — कोई अभी सुनने के लिए तैयार है।',
      lines: [
        {
          emoji:  '📞',
          title:  'iCall: 9152987821',
          sub:    'सोम–शनि, सुबह 8 – रात 10 बजे',
          action: 'tel:9152987821',
        },
        {
          emoji:  '💬',
          title:  'Vandrevala Foundation: 1860-2662-345',
          sub:    '24/7, निःशुल्क',
          action: 'tel:18602662345',
        },
        {
          emoji:  '🌍',
          title:  'अंतर्राष्ट्रीय हेल्पलाइन',
          sub:    'findahelpline.com · दुनिया भर के संसाधन',
          action: 'https://findahelpline.com',
        },
      ],
      confirmBtn: 'मैं मदद लूँगा / लूँगी',
      saveBtn:    'फिर भी मेरी प्रविष्टि सहेजें',
    },

    crisisKeywords: {
      suicidalIdeation: ['आत्महत्या', 'खुदकुशी', 'मरना चाहता हूँ', 'मरना चाहती हूँ', 'मर जाना चाहता हूँ', 'आत्मघात'],
      hopelessness: ['जीना नहीं चाहता', 'जीना नहीं चाहती'],
      givingUp: [
        'जिंदगी खत्म करना', 'सब छोड़ देना चाहता हूँ', 'सब छोड़ देना चाहती हूँ',
        'गायब हो जाना चाहता हूँ', 'गायब हो जाना चाहती हूँ',
      ],
      selfHarm: ['खुद को नुकसान', 'खुद को चोट'],
      overdose: ['दवा की अधिक मात्रा', 'ओवरडोज़'],
    },

    deleteConfirm: {
      title:   'प्रविष्टि हटाएँ?',
      body:    'यह प्रविष्टि स्थायी रूप से हट जाएगी।',
      confirm: 'हटाएँ',
      cancel:  'रद्द करें',
    },
  },

  today: { title: 'आज', checkIn: 'अभी कैसा महसूस कर रहे हैं?', logEmotion: 'भावना दर्ज करें', streakDays: 'दिन लगातार', streakStart: 'स्ट्रीक शुरू करने के लिए आज भावना दर्ज करें', tools: 'त्वरित उपकरण', breatheTitle: 'बॉक्स ब्रीदिंग', breatheSub: '4-4-4-4 · तंत्रिका तंत्र को शांत करें', groundTitle: '5-4-3-2-1 ग्राउंडिंग', groundSub: 'वर्तमान क्षण से जुड़ें', todayEmotions: 'आज की भावनाएँ', noEmotionsYet: 'आज अभी कोई भावना दर्ज नहीं हुई', quote: 'दैनिक विचार', journalEntries: 'डायरी\nप्रविष्टियाँ', emotionsLogged: 'भावनाएँ\nदर्ज' },
  feelingsLibraryScreen: { title: 'भावना पुस्तकालय', subtitle: 'महसूस करें, सुनें, सहज बनें', cardTitle: 'भावना पुस्तकालय', cardSub: '8 सामान्य भावनाएँ जानें', back: 'वापस', noticeLabel: 'महसूस करें', hearLabel: 'सुनें', feelLabel: 'अनुभव', easeLabel: 'सहज बनें', exploreLabel: 'जानें', affirmationLabel: 'आपकी भावना के अनुसार' },
  emotionsScreen: { title: 'भावनाएँ', subtitle: 'अभी क्या महसूस हो रहा है?', selectEmotion: 'अपनी भावना पर टैप करें', intensity: 'तीव्रता', intensityLow: 'हल्का', intensityHigh: 'तीव्र', contextTags: 'अभी क्या हो रहा है?', bodyCheckIn: 'कहाँ महसूस हो रहा है?', copingActions: 'आपने क्या किया?', note: 'नोट जोड़ें (वैकल्पिक)', notePlaceholder: 'इस भावना के बारे में विचार…', saveBtn: 'भावना दर्ज करें', savedBtn: '✓ दर्ज हो गया!', pastTitle: 'हाल की भावनाएँ', emptyTitle: 'आपकी भावनाएँ यहाँ दिखेंगी', emptyBody: 'पहली भावना दर्ज करने के लिए ऊपर टैप करें', otherPill: '+ अन्य', customPlaceholder: 'अपनी भावना लिखें…', quickLog: 'त्वरित लॉग', fullLog: 'पूर्ण लॉग', selectedEmotion: 'चुना गया', deleteConfirm: { title: 'भावना लॉग हटाएँ?', body: 'यह प्रविष्टि स्थायी रूप से हट जाएगी।', confirm: 'हटाएँ', cancel: 'रद्द करें' } },
  insightsScreen: { title: 'विश्लेषण', subtitle: 'समय के साथ आपके पैटर्न', monthlyReport: 'इस महीने', totalEntries: 'डायरी प्रविष्टियाँ', totalEmotions: 'भावनाएँ दर्ज', avgIntensity: 'औसत तीव्रता', topEmotion: 'सबसे अधिक महसूस की गई', topTrigger: 'मुख्य ट्रिगर', streakRecord: 'सर्वश्रेष्ठ स्ट्रीक', timeOfDay: 'दिन का समय', morning: 'सुबह', afternoon: 'दोपहर', evening: 'शाम', night: 'रात', triggers: 'भावनात्मक ट्रिगर', noTriggers: 'संदर्भ टैग के साथ भावनाएँ दर्ज करें', moodCalendar: 'मूड कैलेंडर', weeklyReview: 'साप्ताहिक समीक्षा', weeklyReviewPrompt: 'रविवार है — इस सप्ताह पर विचार करने का समय', weeklyReviewBtn: 'समीक्षा शुरू करें', exportTitle: 'डेटा निर्यात', exportBtn: 'JSON के रूप में निर्यात', exportSuccess: 'सहेजा गया!', empty: { title: 'यहाँ आपकी अंतर्दृष्टि बनेगी', body: 'भावनाएँ और प्रविष्टियाँ दर्ज करें।' }, last7: 'पिछले 7 दिन', chartLegend: 'प्रत्येक बिंदु उस दिन का औसत मूड', moodBreakdown: 'मूड विश्लेषण', streakMotiv: { week: 'अद्भुत! पूरा सप्ताह! 🌟', days: 'दिन लगातार!', sub: 'आप आत्म-देखभाल की आदत बना रहे हैं।' }, insights: { title: 'अंतर्दृष्टि', topMood: 'सबसे अधिक दर्ज किया गया मूड', trend: { label: 'मूड प्रवृत्ति', up: '↑ पिछले सप्ताह से बेहतर', down: '↓ पिछले सप्ताह से कम', flat: '→ पिछले सप्ताह जैसा', none: 'अधिक प्रविष्टियाँ करें' }, bestDay: 'सबसे अच्छा दिन', noPattern: 'पैटर्न देखने के लिए रोज़ लिखें' } },
  settingsScreen: { title: 'सेटिंग', notifications: 'दैनिक अनुस्मारक', notificationsOff: 'बंद', notificationsOn: 'चालू', reminderTime: 'अनुस्मारक समय', reminderDays: 'दिन', appearance: 'रूप-रंग', themeSystem: 'सिस्टम', themeLight: 'हल्का', themeDark: 'गहरा', language: 'भाषा', data: 'आपका डेटा', exportData: 'सारा डेटा निर्यात करें (JSON)', shareClarityAI: 'ClarityAI के साथ डेटा साझा करें', deleteData: 'सारा डेटा हटाएँ', deleteConfirm: { title: 'सारा डेटा हटाएँ?', body: 'सभी डायरी, भावनाएँ और सेटिंग स्थायी रूप से हट जाएंगी।', confirm: 'सब हटाएँ', cancel: 'रद्द करें' }, timePicker: { title: 'अनुस्मारक समय', hourLabel: 'घंटा', minuteLabel: 'मिनट', confirm: 'अनुस्मारक सेट करें', cancel: 'रद्द करें' }, notifPermission: { title: 'अनुमति आवश्यक है', body: 'दैनिक अनुस्मारक पाने के लिए कृपया अपनी डिवाइस सेटिंग में सूचनाएं चालू करें।' }, dataDeleted: { title: 'हो गया', body: 'सारा डेटा हटा दिया गया है।' }, exportSaved: { title: 'निर्यात हो गया', bodyPrefix: 'यहाँ सहेजा गया: ' }, exportFailed: { title: 'निर्यात विफल', fallbackBody: 'कुछ गड़बड़ हो गई।' }, privacy: 'गोपनीयता नीति', youtube: 'YouTube पर देखें', version: 'संस्करण', daysShort: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'], about: 'ऐप के बारे में', aboutBody: 'Clarity in Calm एक निजी ऑफलाइन वेलनेस ऐप है।', account: { header: 'खाता', subtitle: 'सिंक और बैकअप के लिए साइन इन करें।', signIn: 'साइन इन करें / खाता बनाएँ', signOut: 'साइन आउट', deleteAccount: 'खाता हटाएँ', deleteConfirm: { title: 'खाता हटाएँ?', body: 'इससे आपका खाता स्थायी रूप से हट जाएगा और इसे पूर्ववत नहीं किया जा सकता।', confirm: 'हटाएँ', cancel: 'रद्द करें' }, deleteError: { title: 'खाता नहीं हटाया जा सका', body: 'कृपया फिर से प्रयास करें।' } } },
  authScreen: { signIn: { title: 'वापसी पर स्वागत है', subtitle: 'Clarity in Calm में साइन इन करें।', emailLabel: 'ईमेल', emailPlaceholder: 'email@example.com', passwordLabel: 'पासवर्ड', passwordPlaceholder: '••••••••', forgotPassword: 'पासवर्ड भूल गए?', submit: 'साइन इन करें', or: 'या', continueWithGoogle: 'Google से जारी रखें', noAccountPrefix: 'खाता नहीं है? ', signUpLink: 'साइन अप करें', errors: { missingCredentials: 'अपना ईमेल और पासवर्ड डालें', generic: 'साइन इन नहीं हो सका। कृपया फिर से प्रयास करें।', google: 'Google से साइन इन नहीं हो सका। कृपया फिर से प्रयास करें।' } }, signUp: { title: 'अपना खाता बनाएँ', subtitle: 'Clarity in Calm का उपयोग शुरू करने के लिए साइन अप करें।', emailLabel: 'ईमेल', emailPlaceholder: 'email@example.com', passwordLabel: 'पासवर्ड', passwordPlaceholder: 'कम से कम 8 अक्षर', consentPrefix: '', consentLink: 'मैं गोपनीयता नीति से सहमत हूँ', submit: 'साइन अप करें', hasAccountPrefix: 'पहले से खाता है? ', signInLink: 'साइन इन करें', confirmEmailNotice: 'अपना खाता पुष्ट करने के लिए ईमेल जाँचें', errors: { missing: 'एक ईमेल और पासवर्ड डालें', passwordTooShort: 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए', consentRequired: 'जारी रखने के लिए गोपनीयता नीति से सहमत हों', generic: 'खाता नहीं बनाया जा सका। कृपया फिर से प्रयास करें।' } }, forgotPassword: { title: 'अपना पासवर्ड रीसेट करें', subtitle: 'हम आपको पासवर्ड रीसेट करने के लिए एक लिंक ईमेल करेंगे।', emailLabel: 'ईमेल', emailPlaceholder: 'email@example.com', submit: 'रीसेट लिंक भेजें', sentBodyPrefix: 'अगर ', sentBodySuffix: ' के लिए कोई खाता मौजूद है, तो हमने पासवर्ड रीसेट करने के लिए एक लिंक भेज दिया है।', backToSignIn: 'साइन इन पर वापस जाएँ', cancel: 'रद्द करें', errors: { missingEmail: 'अपना ईमेल डालें', generic: 'रीसेट ईमेल नहीं भेजा जा सका। कृपया फिर से प्रयास करें।' } }, resetPassword: { title: 'नया पासवर्ड सेट करें', passwordLabel: 'नया पासवर्ड', passwordPlaceholder: 'कम से कम 8 अक्षर', submit: 'पासवर्ड अपडेट करें', errors: { expiredLink: 'यह रीसेट लिंक समाप्त हो गया है। नया लिंक माँगें।', passwordTooShort: 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए', generic: 'पासवर्ड अपडेट नहीं हो सका। कृपया फिर से प्रयास करें।' } }, oauth: { googleGenericError: 'Google साइन-इन शुरू नहीं हो सका', appleNoToken: 'Apple साइन-इन से पहचान टोकन नहीं मिला', appleGenericError: 'Apple से साइन इन नहीं हो सका। कृपया फिर से प्रयास करें।' } },
  journalExtended: { searchPlaceholder: 'प्रविष्टियाँ खोजें…', templates: 'टेम्पलेट', tags: 'टैग', addTag: '+ टैग जोड़ें', calendar: 'कैलेंडर', futureSelf: 'भविष्य का मैं', futureSelfTitle: 'भविष्य के मुझे लिखें', futureSelfSubtitle: 'इस पत्र को खोलने की तारीख चुनें', futureSelfLocked: 'खुलेगा', futureSelfUnlock: 'पत्र खोलें', unlockDate: 'खुलने की तारीख', setDate: 'तारीख सेट करें', templateFreeWrite: 'स्वतंत्र लेखन', templateGratitude: 'कृतज्ञता', templateReflection: 'दैनिक समीक्षा', templateCBT: 'विचार जाँच', templateWeeklyReview: 'साप्ताहिक समीक्षा', templateFutureSelf: 'भविष्य का मैं', templatePrompts: { gratitude: ['1. मैं इसके लिए आभारी हूँ...', '2. कोई छोटी सी बात जिसने मुझे मुस्कुराया...', '3. वह व्यक्ति जिसकी मैं सराहना करता/करती हूँ और क्यों...'], reflection: ['आज मुझे किस चीज़ ने थकाया?', 'आज मुझे किस चीज़ ने ऊर्जा दी?', 'कल मैं क्या अलग करूँगा/करूँगी?'], cbt: ['वह विचार जो बार-बार आता है:', 'इस विचार का समर्थन करने वाले प्रमाण:', 'इस विचार के खिलाफ प्रमाण:', 'इसे देखने का एक अधिक संतुलित तरीका:'], 'weekly-review': ['इस हफ्ते मुझे किस चीज़ ने थकाया?', 'इस हफ्ते मुझे किस चीज़ ने ऊर्जा दी?', 'एक उपलब्धि जिस पर मुझे गर्व है:', 'अगले हफ्ते के लिए एक इरादा:'], 'future-self': ['प्रिय भविष्य के मुझे,', 'अभी मैं महसूस कर रहा/रही हूँ...', 'कुछ जो मैं चाहता/चाहती हूँ तुम याद रखो:', 'एक प्रोत्साहन भरा संदेश:'] }, noResults: 'कोई परिणाम नहीं', customTagPlaceholder: 'टैग…', addTagConfirm: 'जोड़ें', deleteEntry: 'हटाएँ', tagLabels: { work: 'काम', home: 'घर', family: 'परिवार', health: 'स्वास्थ्य', relationship: 'रिश्ता', growth: 'विकास', gratitude: 'आभार', stress: 'तनाव', joy: 'खुशी', sleep: 'नींद' } },
  dailyContent: {
    quotes: [
      { text: 'एक सांस लें। यह बस एक बुरा दिन है, बुरी ज़िंदगी नहीं।', author: 'अज्ञात' },
      { text: 'आपको अपने विचारों को नियंत्रित करने की ज़रूरत नहीं है। बस उन्हें आप पर हावी होने से रोकना है।', author: 'डैन मिलमैन' },
      { text: 'लगभग हर चीज़ कुछ मिनट के लिए बंद करने पर फिर से ठीक काम करने लगती है — आप भी।', author: 'ऐन लैमॉट' },
      { text: 'शांति भीतर से आती है। इसे बाहर मत खोजो।', author: 'बुद्ध' },
      { text: 'आप काफी हैं। आप हमेशा से काफी रहे हैं।', author: 'अज्ञात' },
      { text: 'आपके भीतर एक शांति और एक शरण-स्थल है, जहाँ आप कभी भी लौट सकते हैं।', author: 'हरमन हेसे' },
      { text: 'वर्तमान क्षण ही एकमात्र समय है जिस पर हमारा अधिकार है।', author: 'थिक न्हात हान' },
      { text: 'साँस लें। छोड़ दें। और खुद को याद दिलाएं कि यही एक पल है जिसके बारे में आप निश्चित रूप से जानते हैं कि आपके पास है।', author: 'ओप्रा विनफ्रे' },
      { text: 'स्वयं की देखभाल आत्म-भोग नहीं है। यह आत्म-संरक्षण है।', author: 'ऑड्रे लॉर्ड' },
      { text: 'कठिनाई के बीच में ही अवसर छिपा होता है।', author: 'अल्बर्ट आइंस्टीन' },
      { text: 'खुशी कोई बनी-बनाई चीज़ नहीं है। यह आपके अपने कार्यों से आती है।', author: 'दलाई लामा' },
      { text: 'अपना ख्याल रखना स्वार्थ नहीं है — यह ज़रूरी है।', author: 'अज्ञात' },
      { text: 'आपको हर समय सकारात्मक रहने की ज़रूरत नहीं है। उदास, गुस्सा, चिड़चिड़ा या चिंतित महसूस करना बिल्कुल ठीक है।', author: 'लॉरी डेशेन' },
      { text: 'जहाँ हैं वहीं से शुरू करें। जो है उसका उपयोग करें। जो कर सकते हैं वह करें।', author: 'आर्थर ऐश' },
      { text: 'सबसे अंधेरी रात भी खत्म होगी और सूरज फिर उगेगा।', author: 'विक्टर ह्यूगो' },
    ],
    feelingsEase: {
      anger: 'आपको गुस्सा आने पर हर आवेग पर काम करने की ज़रूरत नहीं है। इसे शब्द देने से पहले इसे शरीर से जाहिर करें — टहलें, कुछ गहरी साँसें छोड़ें।',
      anxiousness: "आपको आज रात हर 'क्या होगा अगर' को हल करने की ज़रूरत नहीं है। अभी आप जिस एक चीज़ को नियंत्रित कर सकते हैं उसे नाम देना आमतौर पर इस चक्र को ढीला करने के लिए काफी होता है।",
      burnout: 'आराम कोई ऐसी चीज़ नहीं है जो आप सब कुछ खत्म करने के बाद कमाते हैं — यही वह चीज़ है जो किसी भी काम को पूरा करना संभव बनाती है। एक चीज़ इंतज़ार कर सकती है।',
      fear: 'डर को ज़ोर से नाम देना, भले ही सिर्फ खुद से, उसकी कुछ ताकत छीन लेता है। पूछें कि अभी, इस कमरे में, वास्तव में क्या हो रहा है — बनाम आपका मन क्या अनुमान लगा रहा है।',
      sadness: 'उदासी को तुरंत ठीक करने की ज़रूरत नहीं है — इसे जगह चाहिए। बेहतर महसूस करने की जल्दी किए बिना, खुद को कुछ मिनट इसे महसूस करने दें।',
      insecurity: 'जो आवाज़ आप पर शक करती है वह कोई निष्पक्ष जज नहीं है — यह सोचने की एक डरी हुई, पुरानी आदत है। आपको इससे असहमत होने की अनुमति है।',
      loneliness: 'अकेलापन छोटे, असली संपर्क से भी कम हो जाता है — एक संदेश, एक कॉल, कहीं लोगों के बीच बैठना। इसे एक बार में हल करने की ज़रूरत नहीं है।',
      overwhelm: 'आपको सब कुछ एक साथ संभालने की ज़रूरत नहीं है। सबसे छोटा अगला कदम चुनें और बाकी को अपनी बारी का इंतज़ार करने दें।',
    },
  },

  emotionsCatalog: {
    basicEmotions: {
      happiness: 'ख़ुशी',
      sadness:   'उदासी',
      fear:      'डर',
      disgust:   'घृणा',
      anger:     'गुस्सा',
      contempt:  'तिरस्कार',
      surprise:  'आश्चर्य',
    },
    copingActions: {
      breathing:  'गहरी साँस',
      journaling: 'जर्नलिंग',
      walk:       'टहलना/व्यायाम',
      call:       'किसी को फोन किया',
      rest:       'आराम/नींद',
      music:      'संगीत',
      meditation: 'ध्यान',
      water:      'पानी पिएं',
      grounding:  '5-4-3-2-1',
      nothing:    'अभी कुछ नहीं',
    },
     bodyRegions: {
  head:      'सिर',
  throat:    'गला',
  chest:     'छाती',
  stomach:   'पेट',
  shoulders: 'कंधे',
  arms:      'बाहें',
  legs:      'पैर',
  hands:     'हाथ',
},
  },

  feelingsLibraryContent: {
    anger: {
      label: 'गुस्सा',
      notice: 'छोटा धैर्य, भिंची हुई जबड़ा, ऐसी चीज़ों पर भड़क जाना जो सामान्यतः परेशान नहीं करतीं। यह अक्सर तेज़ी से आता है और तुरंत उस पर काम करना चाहता है।',
      hear: 'गुस्सा आमतौर पर कहता है "यह उचित नहीं है" या "मुझे अभी इसे ठीक करना है।" यह किसी टूटी हुई सीमा की रक्षा कर रहा होता है, भले ही आपके गुस्से का निशाना असली वजह न हो।',
      feel: 'छाती और चेहरे में गर्मी, कसी हुई मुट्ठियाँ या जबड़ा, तेज़ धड़कन, हिलने या तीखा बोलने की इच्छा।',
      explore: [
        'अभी किस सीमा का उल्लंघन महसूस हो रहा है — और क्या यह सच में अभी की बात है, या कुछ पुरानी?',
        'अगर आप जो सोच रहे हैं उसका ईमानदार संस्करण कहें, तो वह क्या होगा?',
        'एक दिन बाद "सुलझा हुआ" असल में कैसा दिखेगा?',
      ],
    },
    anxiousness: {
      label: 'चिंता',
      notice: 'सबसे बुरी संभावनाओं के बीच कूदते तेज़ विचार, बेचैनी, बार-बार चीज़ें जांचना, किसी एक काम पर टिक न पाना।',
      hear: 'चिंता अक्सर "क्या होगा अगर" को दोहराती रहती है। यह हर संभावित खतरे का पूर्वाभ्यास करके आपको तैयार करने की कोशिश कर रही है।',
      feel: 'पेट में फड़फड़ाहट या कसाव, उथली साँसें, हाथ-पैरों में घबराई या बेचैन भावना।',
      explore: [
        'इस चिंता का कौन-सा हिस्सा वाकई आज आपके नियंत्रण में है?',
        'आपका मन जो कहानी सुना रहा है वह क्या है, और उसे कौन-सा सबूत वाकई साबित करता है?',
        'पहले अनिश्चितता से निकलने में आपकी क्या मदद मिली थी?',
      ],
    },
    burnout: {
      label: 'बर्नआउट',
      notice: 'जहाँ पहले जोश था वहाँ अब सपाटपन, आसान लगने वाले कामों को भी घसीटते हुए करना, यह महसूस होना कि आराम भी भर नहीं पाता।',
      hear: 'बर्नआउट कहता है "मुझे चलते रहना चाहिए" — टैंक खाली होने के बहुत बाद तक। यह थकान को चरित्र की कमी समझ बैठता है, जबकि यह एक संकेत है।',
      feel: 'अंगों में भारीपन, धुंधली सोच, आँखों के पीछे हल्का दर्द, पसंदीदा चीज़ों के लिए भी कम प्रेरणा।',
      explore: [
        'चुपचाप क्या "अनिवार्य" बन गया है जिस पर असल में फिर से बात हो सकती है?',
        'आखिरी बार आपको खुद जैसा कब महसूस हुआ था, और उस दिन क्या अलग था?',
        'अगर आप इस हफ्ते खुद को कम करने की इजाज़त दें, तो सबसे पहले क्या छोड़ेंगे?',
      ],
    },
    fear: {
      label: 'डर',
      notice: 'अचानक सतर्कता, किसी खास स्थिति से बचना या भाग जाना चाहना, ऐसा मन जो बार-बार खतरे की ओर लौटता है।',
      hear: 'डर कहता है "यह मुझे नुकसान पहुँचा सकता है" और आपका ध्यान खतरे पर केंद्रित कर देता है। यह एक पुराना, तेज़ सिस्टम है जो आपको सुरक्षित रखने की कोशिश करता है, भले ही खतरा शारीरिक से ज़्यादा अनिश्चित हो।',
      feel: 'छाती में झटका, ठंडे हाथ, रुकी हुई साँस, हिलने के लिए तैयार मांसपेशियाँ।',
      explore: [
        'ठोस शब्दों में, आपको वास्तव में किस बात का डर है कि क्या होगा?',
        'क्या यह डर पहले सही साबित हुआ है, या यह खतरे को बढ़ा-चढ़ाकर आंकता है?',
        'जिस चीज़ से आप बच रहे हैं, उसकी ओर एक छोटा कदम क्या हो सकता है?',
      ],
    },
    sadness: {
      label: 'उदासी',
      notice: 'कम ऊर्जा, आँसू आना, पीछे हटना या चुप हो जाना चाहना, जो चीज़ें पहले हल्की लगती थीं वे अब भारी लगना।',
      hear: 'उदासी कहती है "कुछ मायने रखता था और वह जा रहा है, या जा चुका है।" यह हानि की स्वाभाविक प्रतिक्रिया है, भले ही उस हानि को नाम देना मुश्किल हो।',
      feel: 'छाती में भारीपन, गले में गांठ, थकी हुई आँखें, धीमा शरीर।',
      explore: [
        'ठीक-ठीक क्या खोया हुआ महसूस हो रहा है?',
        'अभी कौन या क्या सिर्फ पास होने से मदद करेगा?',
        'आज दिलासा — भटकाव नहीं — कैसा दिखेगा?',
      ],
    },
    insecurity: {
      label: 'असुरक्षा',
      notice: 'अपने फैसलों पर बार-बार शक करना, खुद की दूसरों से तुलना करना, ऐसी आवाज़ जो किसी और से पहले खामी ढूंढ लेती है।',
      hear: 'असुरक्षा कहती है "तुम काफी नहीं हो" या "उन्हें पता चल जाएगा।" यह अक्सर न जुड़ पाने के पुराने डर का ही आत्म-आलोचना का रूप होता है।',
      feel: 'पेट में डूबने जैसा एहसास, सिकुड़ी हुई मुद्रा, चेहरे में गर्माहट (शर्म की करीबी रिश्तेदार)।',
      explore: [
        'यह आलोचना असल में किसकी आवाज़ जैसी लगती है?',
        'अगर कोई दोस्त बिल्कुल ऐसा ही महसूस करे तो आप उससे क्या कहेंगे?',
        'इस शक के खिलाफ एक असली सबूत क्या है?',
      ],
    },
    loneliness: {
      label: 'अकेलापन',
      notice: 'दूसरों के बीच रहते हुए भी एक शांत दर्द, और अलग-थलग होने की खिंचाव, अनदेखा या अपहुँच महसूस होना।',
      hear: 'अकेलापन कहता है "कोई वाकई इसे नहीं समझता" या "मैं यहाँ अकेला हूँ।" यह इस बात का संकेत है कि जुड़ाव की कमी है, इस बात का सबूत नहीं कि वह उपलब्ध नहीं है।',
      feel: 'छाती में खालीपन, कम ऊर्जा, शांत पलों में बैठने वाला भारीपन।',
      explore: [
        'आज आप किस एक व्यक्ति से, भले ही थोड़ी देर के लिए, संपर्क कर सकते हैं?',
        'आखिरी बार आपने सच में समझा हुआ कब महसूस किया था, और उसे किसने संभव बनाया?',
        'क्या यह अकेलापन अकेले होने के बारे में है, या अनदेखा महसूस करने के बारे में?',
      ],
    },
    overwhelm: {
      label: 'अभिभूत होना',
      notice: 'एक साथ बहुत सारी चीज़ों का खिंचाव, यह तय करना मुश्किल कि कहाँ से शुरू करें, स्पष्ट सोच की जगह धुंधलापन या जमा हुआ महसूस होना।',
      hear: 'अभिभूत होना कहता है "बहुत कुछ है और मैं काफी नहीं हूँ।" यह ऐसा नहीं कि आप संभाल नहीं सकते — बल्कि बहुत सारी चीज़ें एक साथ ध्यान माँग रही हैं।',
      feel: 'जकड़ी हुई छाती, उथली साँसें, सिर में भिनभिनाहट या बिखरा हुआ एहसास, बेचैनी या जम जाना।',
      explore: [
        'अगर आज आप सिर्फ एक काम कर पाएँ, तो असल में सबसे ज़्यादा मायने क्या रखेगा?',
        'आपकी सूची में क्या ऐसा है जिसे टाला, छोड़ा या सौंपा जा सकता है?',
        'इसे अधूरे तरीके से करना, बिल्कुल न करने से कैसा महसूस होगा?',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSLATIONS: Record<Locale, Translations> = { en, ko, es, hi };
