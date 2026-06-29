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
    progress: 'Progress',
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
        body: 'A quiet space to breathe, reflect, and understand your emotions — everything stored privately on this device.',
      },
      {
        emoji: '🌬️',
        title: 'Box Breathing',
        body: 'Tap the Breathe tab and press Start. The circle guides each phase — Inhale, Hold, Exhale, Rest — each lasting 4 seconds.',
      },
      {
        emoji: '📖',
        title: 'Journal & Progress',
        body: "Pick a mood, write whatever's on your mind, and watch patterns emerge in your Progress tab over time.",
      },
      {
        emoji: '✨',
        title: 'Track Your Progress',
        body: 'Your streak, mood patterns, and breathing sessions are all captured in the Progress tab — come back daily and watch the picture build.',
      },
    ],
    next:       'Next',
    getStarted: "Let's go",
    privacy:    '🔒 Your data never leaves your device',
    reportIssue: 'Report an issue',
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

    crisisKeywords: [
      'suicide', 'suicidal', 'kill myself', 'end my life', 'take my life',
      "don't want to live", 'dont want to live', 'want to die', 'wanted to die',
      'no reason to live', 'better off dead', 'better off without me',
      "can't go on", 'cant go on', 'ending it', 'end it all',
      'hurt myself', 'self harm', 'self-harm', 'cutting myself',
      'overdose', 'not worth living',
    ],

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
    selectEmotion: 'Tap an emotion on the wheel',
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
    emptyBody: 'Tap the wheel above to log your first emotion',
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
    exportBtn: 'Export as PDF',
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
    clarityUnlock: 'Clarity Unlock',
    unlocked: '✓ Unlocked',
    unlockTitle: 'Unlock Full Clarity',
    unlockPrice: '$4.99 · One-time, no subscription',
    unlockFeatures: [
      'Full Plutchik emotion wheel',
      'Unlimited history & analytics',
      'PDF reports & data export',
      'Future Self Letters',
      'Advanced pattern insights',
      'Custom journal templates',
    ],
    unlockBtn: 'Unlock for $4.99',
    restoreBtn: 'Restore purchase',
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
    deleteData: 'Delete all data',
    deleteConfirm: {
      title: 'Delete all data?',
      body: 'This will permanently erase all journal entries, emotion logs, and settings. This cannot be undone.',
      confirm: 'Delete everything',
      cancel: 'Cancel',
    },
    privacy: 'Privacy policy',
    version: 'Version',
    daysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    about: 'About',
    aboutBody: 'Clarity in Calm is a private, offline-first wellness journal. All data is encrypted on your device and never leaves it.',
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
    noResults: 'No entries match your search',
    customTagPlaceholder: 'custom tag…',
    addTagConfirm: 'Add',
    deleteEntry: 'Delete',
  },

  // ── Progress ──────────────────────────────────────────────────────────────
  progress: {
    title:    'Progress',
    subtitle: 'Your wellness journey',
    stats: {
      entries:  'journal entries',
      sessions: 'breathing sessions',
      avgMood:  'average mood',
    },
    last7:        'Last 7 days',
    chartLegend:  'Each dot shows your average mood that day',
    streakHow:    'Log a journal entry every day to grow your streak',
    moodBreakdown:'Mood breakdown',
    streakMotiv: {
      week: 'Amazing! A full week! 🌟',
      days: 'days in a row!',
      sub:  "You're building a real self-care habit. Keep going — every day counts.",
    },
    empty: {
      title: 'Start your journey',
      body:  'Log your first mood in the Journal tab to see your progress here.',
    },
    insights: {
      title:    'Insights',
      topMood:  'Most logged mood',
      trend: {
        label: 'Mood trend',
        up:    '↑ Improving vs last week',
        down:  '↓ Declining vs last week',
        flat:  '→ Stable vs last week',
        none:  'Log more entries to see your trend',
      },
      bestDay:   'Best day of your week',
      noPattern: 'Keep logging to discover patterns',
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
    progress: '진행',
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
        body: '호흡하고, 생각을 정리하고, 감정을 이해하는 조용한 공간 — 모든 것이 이 기기에 안전하게 저장돼요.',
      },
      {
        emoji: '🌬️',
        title: '박스 호흡',
        body: '호흡 탭을 열고 시작을 누르세요. 원이 각 단계를 안내해요 — 들이쉬기, 참기, 내쉬기, 쉬기 — 각각 4초입니다.',
      },
      {
        emoji: '📖',
        title: '일기와 진행 상황',
        body: '기분을 선택하고, 마음에 있는 것을 자유롭게 쓰고, 시간이 지나면서 진행 탭에서 패턴을 확인하세요.',
      },
      {
        emoji: '✨',
        title: '진행 상황 추적하기',
        body: '연속 기록, 기분 패턴, 호흡 세션이 모두 진행 탭에 쌓여요 — 매일 돌아오면 그림이 만들어져요.',
      },
    ],
    next:       '다음',
    getStarted: '시작하기',
    privacy:    '🔒 데이터는 절대 이 기기를 벗어나지 않아요',
    reportIssue: '문제 신고하기',
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

    crisisKeywords: [
      '자살', '자살하고 싶다', '자살하고싶다',
      '죽고 싶다', '죽고싶다', '죽어버리고 싶다', '죽고 싶어',
      '살기 싫다', '살기싫다', '살고 싶지 않다',
      '삶을 끝내고 싶다', '삶을 포기', '삶을 포기하고 싶다',
      '목숨을 끊다', '스스로 목숨을 끊다',
      '자해', '스스로를 해치다', '스스로 해치고 싶다',
      '사라지고 싶다', '더 이상 살고 싶지 않다',
      '죽겠다', '죽을 것 같다', '죽는 게 낫다',
    ],

    deleteConfirm: {
      title:   '기록을 삭제할까요?',
      body:    '이 기록은 영구적으로 삭제됩니다.',
      confirm: '삭제',
      cancel:  '취소',
    },
  },

  today: { title: '오늘', checkIn: '지금 기분이 어떠세요?', logEmotion: '감정 기록', streakDays: '일 연속', streakStart: '오늘 감정을 기록해 스트릭을 시작하세요', tools: '빠른 도구', breatheTitle: '박스 호흡', breatheSub: '4-4-4-4 · 신경계 안정', groundTitle: '5-4-3-2-1 그라운딩', groundSub: '현재 순간에 집중하기', todayEmotions: '오늘의 감정', noEmotionsYet: '오늘 아직 기록된 감정이 없어요', quote: '오늘의 명언', journalEntries: '일기\n기록', emotionsLogged: '감정\n기록' },
  emotionsScreen: { title: '감정', subtitle: '지금 어떤 감정인가요?', selectEmotion: '바퀴에서 감정을 탭하세요', intensity: '강도', intensityLow: '약함', intensityHigh: '강함', contextTags: '지금 무슨 상황인가요?', bodyCheckIn: '어디서 느껴지나요?', copingActions: '어떻게 했나요?', note: '노트 추가 (선택사항)', notePlaceholder: '이 감정에 대한 생각…', saveBtn: '감정 기록하기', savedBtn: '✓ 저장됨!', pastTitle: '최근 감정', emptyTitle: '감정 기록이 여기 나타납니다', emptyBody: '위의 바퀴를 탭해 첫 감정을 기록하세요', quickLog: '빠른 기록', fullLog: '전체 기록', selectedEmotion: '선택됨', deleteConfirm: { title: '감정 기록 삭제?', body: '이 항목이 영구적으로 삭제됩니다.', confirm: '삭제', cancel: '취소' } },
  insightsScreen: { title: '분석', subtitle: '시간에 따른 패턴', monthlyReport: '이번 달', totalEntries: '일기 기록', totalEmotions: '감정 기록', avgIntensity: '평균 강도', topEmotion: '가장 많이 느낀 감정', topTrigger: '주요 트리거', streakRecord: '최고 스트릭', timeOfDay: '시간대', morning: '아침', afternoon: '오후', evening: '저녁', night: '밤', triggers: '감정 트리거', noTriggers: '감정 기록에 상황 태그를 추가하면 트리거가 보여요', moodCalendar: '기분 달력', weeklyReview: '주간 회고', weeklyReviewPrompt: '일요일이에요 — 이번 주를 되돌아볼 시간이에요', weeklyReviewBtn: '회고 시작', exportTitle: '데이터 내보내기', exportBtn: 'PDF로 내보내기', exportSuccess: '저장됨!', empty: { title: '인사이트가 여기 만들어집니다', body: '감정과 일기를 몇 개 기록하면 패턴이 보여요.' }, last7: '최근 7일', chartLegend: '각 점은 그날의 평균 기분', moodBreakdown: '기분 분석', streakMotiv: { week: '대단해요! 일주일! 🌟', days: '일 연속!', sub: '진정한 자기 관리 습관이에요.' }, insights: { title: '인사이트', topMood: '가장 많이 기록한 기분', trend: { label: '기분 추세', up: '↑ 지난 주보다 나아지고 있어요', down: '↓ 지난 주보다 낮아졌어요', flat: '→ 지난 주와 비슷해요', none: '추세를 보려면 더 기록해보세요' }, bestDay: '기분이 가장 좋은 요일', noPattern: '매일 기록하면 패턴이 보여요' } },
  settingsScreen: { title: '설정', clarityUnlock: 'Clarity 잠금 해제', unlocked: '✓ 잠금 해제됨', unlockTitle: 'Clarity 전체 기능 열기', unlockPrice: '$4.99 · 일회 결제, 구독 없음', unlockFeatures: ['전체 감정 바퀴', '무제한 기록 및 분석', 'PDF 보고서 내보내기', '미래의 나에게 편지', '고급 패턴 인사이트', '맞춤 일기 템플릿'], unlockBtn: '$4.99로 잠금 해제', restoreBtn: '구매 복원', notifications: '매일 알림', notificationsOff: '끄기', notificationsOn: '켜기', reminderTime: '알림 시간', reminderDays: '요일', appearance: '외관', themeSystem: '시스템', themeLight: '밝은', themeDark: '어두운', language: '언어', data: '내 데이터', exportData: '전체 데이터 내보내기 (JSON)', deleteData: '전체 데이터 삭제', deleteConfirm: { title: '전체 데이터를 삭제할까요?', body: '모든 일기, 감정 기록, 설정이 영구적으로 삭제됩니다. 취소할 수 없어요.', confirm: '모두 삭제', cancel: '취소' }, privacy: '개인정보 처리방침', version: '버전', daysShort: ['일', '월', '화', '수', '목', '금', '토'], about: '앱 정보', aboutBody: 'Clarity in Calm은 오프라인 우선 웰니스 앱입니다. 모든 데이터는 기기에 암호화되어 저장됩니다.' },
  journalExtended: { searchPlaceholder: '기록 검색…', templates: '템플릿', tags: '태그', addTag: '+ 태그 추가', calendar: '달력', futureSelf: '미래의 나', futureSelfTitle: '미래의 나에게 쓰기', futureSelfSubtitle: '이 편지를 열 날짜를 선택하세요', futureSelfLocked: '열리는 날짜', futureSelfUnlock: '편지 열기', unlockDate: '해제 날짜', setDate: '날짜 설정', templateFreeWrite: '자유 쓰기', templateGratitude: '감사', templateReflection: '하루 회고', templateCBT: '생각 점검', templateWeeklyReview: '주간 회고', templateFutureSelf: '미래의 나', noResults: '검색 결과가 없어요', customTagPlaceholder: '태그 입력…', addTagConfirm: '추가', deleteEntry: '삭제' },
  progress: {
    title:    '진행 상황',
    subtitle: '나의 웰니스 여정',
    stats: {
      entries:  '일기 기록',
      sessions: '호흡 세션',
      avgMood:  '평균 기분',
    },
    last7:        '최근 7일',
    chartLegend:  '각 점은 그날의 평균 기분을 나타내요',
    streakHow:    '매일 일기를 작성하면 연속 기록이 늘어나요',
    moodBreakdown: '기분 분석',
    streakMotiv: {
      week: '대단해요! 일주일 달성! 🌟',
      days: '일 연속 달성!',
      sub:  '진정한 자기 관리 습관을 만들고 있어요. 계속하세요 — 매일이 소중해요.',
    },
    empty: {
      title: '여정을 시작하세요',
      body:  '일기 탭에서 첫 번째 기분을 기록하면 여기서 진행 상황을 볼 수 있어요.',
    },
    insights: {
      title:    '인사이트',
      topMood:  '가장 많이 기록한 기분',
      trend: {
        label: '기분 추세',
        up:    '↑ 지난 주보다 나아지고 있어요',
        down:  '↓ 지난 주보다 낮아졌어요',
        flat:  '→ 지난 주와 비슷해요',
        none:  '추세를 보려면 더 기록해보세요',
      },
      bestDay:   '기분이 가장 좋은 요일',
      noPattern: '매일 기록하면 패턴이 보여요',
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
    progress: 'Progreso',
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
        body: 'Un espacio tranquilo para respirar, reflexionar y entender tus emociones — todo guardado de forma privada en este dispositivo.',
      },
      {
        emoji: '🌬️',
        title: 'Respiración de caja',
        body: 'Toca la pestaña Respirar y presiona Iniciar. El círculo guía cada fase — Inhalar, Sostener, Exhalar, Descansar — cada una dura 4 segundos.',
      },
      {
        emoji: '📖',
        title: 'Diario y Progreso',
        body: 'Elige un estado de ánimo, escribe lo que tengas en mente y observa cómo emergen patrones en la pestaña Progreso con el tiempo.',
      },
      {
        emoji: '✨',
        title: 'Sigue tu progreso',
        body: 'Tu racha, patrones de humor y sesiones de respiración están en la pestaña Progreso — vuelve cada día y observa cómo crece tu historia.',
      },
    ],
    next:       'Siguiente',
    getStarted: '¡Vamos!',
    privacy:    '🔒 Tus datos nunca abandonan tu dispositivo',
    reportIssue: 'Reportar un problema',
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
          emoji:  '🌍',
          title:  'Líneas de ayuda internacionales',
          sub:    'findahelpline.com · Recursos en todo el mundo',
          action: 'https://findahelpline.com',
        },
      ],
      confirmBtn: 'Buscaré ayuda',
      saveBtn:    'Guardar mi entrada de todas formas',
    },

    crisisKeywords: [
      'suicidio', 'suicida', 'matarme', 'terminar con mi vida', 'quitarme la vida',
      'no quiero vivir', 'quiero morir', 'sin razón para vivir',
      'mejor muerto', 'mejor muerta', 'mejor sin mí',
      'no puedo más', 'acabar con todo', 'hacerme daño',
      'autolesión', 'autolesionarme', 'cortarme', 'sobredosis',
      'no vale la pena vivir', 'desaparecer para siempre',
    ],

    deleteConfirm: {
      title:   '¿Eliminar entrada?',
      body:    'Esta entrada se eliminará de forma permanente.',
      confirm: 'Eliminar',
      cancel:  'Cancelar',
    },
  },

  today: { title: 'Hoy', checkIn: '¿Cómo te sientes ahora?', logEmotion: 'Registrar emoción', streakDays: 'días seguidos', streakStart: 'Registra una emoción hoy para comenzar tu racha', tools: 'Herramientas rápidas', breatheTitle: 'Respiración de caja', breatheSub: '4-4-4-4 · Calma tu sistema nervioso', groundTitle: 'Enraizamiento 5-4-3-2-1', groundSub: 'Ancla al momento presente', todayEmotions: 'Emociones de hoy', noEmotionsYet: 'No has registrado emociones hoy', quote: 'Reflexión diaria', journalEntries: 'entradas\nde diario', emotionsLogged: 'emociones\nregistradas' },
  emotionsScreen: { title: 'Emociones', subtitle: '¿Qué sientes ahora?', selectEmotion: 'Toca una emoción en la rueda', intensity: 'Intensidad', intensityLow: 'leve', intensityHigh: 'intensa', contextTags: '¿Qué está pasando?', bodyCheckIn: '¿Dónde lo sientes?', copingActions: '¿Qué hiciste?', note: 'Añadir nota (opcional)', notePlaceholder: 'Pensamientos sobre este sentimiento…', saveBtn: 'Registrar emoción', savedBtn: '✓ ¡Registrado!', pastTitle: 'Emociones recientes', emptyTitle: 'Tus registros aparecerán aquí', emptyBody: 'Toca la rueda para registrar tu primera emoción', quickLog: 'Registro rápido', fullLog: 'Registro completo', selectedEmotion: 'Seleccionado', deleteConfirm: { title: '¿Eliminar registro?', body: 'Este registro se eliminará de forma permanente.', confirm: 'Eliminar', cancel: 'Cancelar' } },
  insightsScreen: { title: 'Análisis', subtitle: 'Tus patrones en el tiempo', monthlyReport: 'Este mes', totalEntries: 'entradas de diario', totalEmotions: 'emociones registradas', avgIntensity: 'intensidad promedio', topEmotion: 'Más sentida', topTrigger: 'Principal desencadenante', streakRecord: 'Mejor racha', timeOfDay: 'Momento del día', morning: 'Mañana', afternoon: 'Tarde', evening: 'Noche', night: 'Madrugada', triggers: 'Desencadenantes', noTriggers: 'Registra emociones con etiquetas para ver desencadenantes', moodCalendar: 'Calendario de ánimo', weeklyReview: 'Revisión semanal', weeklyReviewPrompt: 'Es domingo — hora de reflexionar sobre tu semana', weeklyReviewBtn: 'Comenzar revisión', exportTitle: 'Exportar datos', exportBtn: 'Exportar como PDF', exportSuccess: '¡Guardado!', empty: { title: 'Tus insights se construirán aquí', body: 'Registra algunas emociones y entradas para ver patrones.' }, last7: 'Últimos 7 días', chartLegend: 'Cada punto muestra tu ánimo promedio ese día', moodBreakdown: 'Distribución de ánimo', streakMotiv: { week: '¡Increíble! ¡Una semana! 🌟', days: 'días seguidos', sub: 'Estás creando un hábito de autocuidado.' }, insights: { title: 'Perspectivas', topMood: 'Ánimo más registrado', trend: { label: 'Tendencia', up: '↑ Mejorando vs semana anterior', down: '↓ Bajando vs semana anterior', flat: '→ Estable vs semana anterior', none: 'Registra más para ver tendencias' }, bestDay: 'Tu mejor día', noPattern: 'Sigue registrando para descubrir patrones' } },
  settingsScreen: { title: 'Ajustes', clarityUnlock: 'Clarity Completo', unlocked: '✓ Desbloqueado', unlockTitle: 'Desbloquea todo Clarity', unlockPrice: '$4.99 · Pago único, sin suscripción', unlockFeatures: ['Rueda de emociones completa', 'Historial y análisis ilimitados', 'Exportar reportes en PDF', 'Cartas a tu yo futuro', 'Insights avanzados de patrones', 'Plantillas de diario personalizadas'], unlockBtn: 'Desbloquear por $4.99', restoreBtn: 'Restaurar compra', notifications: 'Recordatorio diario', notificationsOff: 'Apagado', notificationsOn: 'Encendido', reminderTime: 'Hora del recordatorio', reminderDays: 'Días', appearance: 'Apariencia', themeSystem: 'Sistema', themeLight: 'Claro', themeDark: 'Oscuro', language: 'Idioma', data: 'Tus datos', exportData: 'Exportar todos los datos (JSON)', deleteData: 'Eliminar todos los datos', deleteConfirm: { title: '¿Eliminar todos los datos?', body: 'Esto borrará permanentemente todas las entradas, emociones y ajustes.', confirm: 'Eliminar todo', cancel: 'Cancelar' }, privacy: 'Política de privacidad', version: 'Versión', daysShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'], about: 'Acerca de', aboutBody: 'Clarity in Calm es una app de bienestar privada y sin conexión. Todos los datos se cifran en tu dispositivo.' },
  journalExtended: { searchPlaceholder: 'Buscar entradas…', templates: 'Plantillas', tags: 'Etiquetas', addTag: '+ Agregar etiqueta', calendar: 'Calendario', futureSelf: 'Yo futuro', futureSelfTitle: 'Escribir a tu yo futuro', futureSelfSubtitle: 'Elige una fecha para abrir esta carta', futureSelfLocked: 'Se abre el', futureSelfUnlock: 'Abrir carta', unlockDate: 'Fecha de apertura', setDate: 'Establecer fecha', templateFreeWrite: 'Escritura libre', templateGratitude: 'Gratitud', templateReflection: 'Reflexión diaria', templateCBT: 'Revisión de pensamientos', templateWeeklyReview: 'Revisión semanal', templateFutureSelf: 'Yo futuro', noResults: 'Sin resultados para tu búsqueda', customTagPlaceholder: 'etiqueta…', addTagConfirm: 'Agregar', deleteEntry: 'Eliminar' },
  progress: {
    title:    'Progreso',
    subtitle: 'Tu viaje de bienestar',
    stats: {
      entries:  'entradas de diario',
      sessions: 'sesiones de respiración',
      avgMood:  'estado de ánimo promedio',
    },
    last7:        'Últimos 7 días',
    chartLegend:  'Cada punto muestra tu estado de ánimo promedio ese día',
    streakHow:    'Registra una entrada en el diario cada día para aumentar tu racha',
    moodBreakdown: 'Distribución de ánimo',
    streakMotiv: {
      week: '¡Increíble! ¡Una semana completa! 🌟',
      days: 'días seguidos',
      sub:  'Estás creando un hábito real de autocuidado. Sigue adelante — cada día cuenta.',
    },
    empty: {
      title: 'Comienza tu viaje',
      body:  'Registra tu primer estado de ánimo en la pestaña Diario para ver tu progreso aquí.',
    },
    insights: {
      title:    'Perspectivas',
      topMood:  'Estado de ánimo más registrado',
      trend: {
        label: 'Tendencia del ánimo',
        up:    '↑ Mejorando vs la semana pasada',
        down:  '↓ Bajando vs la semana pasada',
        flat:  '→ Estable vs la semana pasada',
        none:  'Registra más entradas para ver tu tendencia',
      },
      bestDay:   'Tu mejor día de la semana',
      noPattern: 'Sigue registrando para descubrir patrones',
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
    progress: 'प्रगति',
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
        body: 'साँस लेने, विचार करने और अपनी भावनाओं को समझने की एक शांत जगह — सब कुछ इस डिवाइस पर निजी रूप से संग्रहीत है।',
      },
      {
        emoji: '🌬️',
        title: 'बॉक्स ब्रीदिंग',
        body: 'साँस टैब खोलें और Start दबाएँ। वृत्त हर चरण का मार्गदर्शन करता है — श्वास लें, रोकें, छोड़ें, आराम — प्रत्येक 4 सेकंड का।',
      },
      {
        emoji: '📖',
        title: 'डायरी और प्रगति',
        body: 'एक मूड चुनें, जो मन में हो लिखें, और समय के साथ प्रगति टैब में अपने पैटर्न देखें।',
      },
      {
        emoji: '✨',
        title: 'अपनी प्रगति ट्रैक करें',
        body: 'आपकी स्ट्रीक, मूड पैटर्न और सांस के सत्र सभी प्रगति टैब में दिखते हैं — रोज़ लौटें और अपना सफर देखें।',
      },
    ],
    next:       'आगे',
    getStarted: 'चलते हैं',
    privacy:    '🔒 आपका डेटा कभी भी इस डिवाइस से बाहर नहीं जाता',
    reportIssue: 'समस्या रिपोर्ट करें',
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

    crisisKeywords: [
      'आत्महत्या', 'खुदकुशी', 'मरना चाहता हूँ', 'मरना चाहती हूँ',
      'मर जाना चाहता हूँ', 'जीना नहीं चाहता', 'जीना नहीं चाहती',
      'जिंदगी खत्म करना', 'खुद को नुकसान', 'खुद को चोट',
      'आत्मघात', 'सब छोड़ देना चाहता हूँ', 'सब छोड़ देना चाहती हूँ',
      'गायब हो जाना चाहता हूँ', 'गायब हो जाना चाहती हूँ',
    ],

    deleteConfirm: {
      title:   'प्रविष्टि हटाएँ?',
      body:    'यह प्रविष्टि स्थायी रूप से हट जाएगी।',
      confirm: 'हटाएँ',
      cancel:  'रद्द करें',
    },
  },

  today: { title: 'आज', checkIn: 'अभी कैसा महसूस कर रहे हैं?', logEmotion: 'भावना दर्ज करें', streakDays: 'दिन लगातार', streakStart: 'स्ट्रीक शुरू करने के लिए आज भावना दर्ज करें', tools: 'त्वरित उपकरण', breatheTitle: 'बॉक्स ब्रीदिंग', breatheSub: '4-4-4-4 · तंत्रिका तंत्र को शांत करें', groundTitle: '5-4-3-2-1 ग्राउंडिंग', groundSub: 'वर्तमान क्षण से जुड़ें', todayEmotions: 'आज की भावनाएँ', noEmotionsYet: 'आज अभी कोई भावना दर्ज नहीं हुई', quote: 'दैनिक विचार', journalEntries: 'डायरी\nप्रविष्टियाँ', emotionsLogged: 'भावनाएँ\nदर्ज' },
  emotionsScreen: { title: 'भावनाएँ', subtitle: 'अभी क्या महसूस हो रहा है?', selectEmotion: 'पहिए पर भावना टैप करें', intensity: 'तीव्रता', intensityLow: 'हल्का', intensityHigh: 'तीव्र', contextTags: 'अभी क्या हो रहा है?', bodyCheckIn: 'कहाँ महसूस हो रहा है?', copingActions: 'आपने क्या किया?', note: 'नोट जोड़ें (वैकल्पिक)', notePlaceholder: 'इस भावना के बारे में विचार…', saveBtn: 'भावना दर्ज करें', savedBtn: '✓ दर्ज हो गया!', pastTitle: 'हाल की भावनाएँ', emptyTitle: 'आपकी भावनाएँ यहाँ दिखेंगी', emptyBody: 'पहली भावना दर्ज करने के लिए पहिए पर टैप करें', quickLog: 'त्वरित लॉग', fullLog: 'पूर्ण लॉग', selectedEmotion: 'चुना गया', deleteConfirm: { title: 'भावना लॉग हटाएँ?', body: 'यह प्रविष्टि स्थायी रूप से हट जाएगी।', confirm: 'हटाएँ', cancel: 'रद्द करें' } },
  insightsScreen: { title: 'विश्लेषण', subtitle: 'समय के साथ आपके पैटर्न', monthlyReport: 'इस महीने', totalEntries: 'डायरी प्रविष्टियाँ', totalEmotions: 'भावनाएँ दर्ज', avgIntensity: 'औसत तीव्रता', topEmotion: 'सबसे अधिक महसूस की गई', topTrigger: 'मुख्य ट्रिगर', streakRecord: 'सर्वश्रेष्ठ स्ट्रीक', timeOfDay: 'दिन का समय', morning: 'सुबह', afternoon: 'दोपहर', evening: 'शाम', night: 'रात', triggers: 'भावनात्मक ट्रिगर', noTriggers: 'संदर्भ टैग के साथ भावनाएँ दर्ज करें', moodCalendar: 'मूड कैलेंडर', weeklyReview: 'साप्ताहिक समीक्षा', weeklyReviewPrompt: 'रविवार है — इस सप्ताह पर विचार करने का समय', weeklyReviewBtn: 'समीक्षा शुरू करें', exportTitle: 'डेटा निर्यात', exportBtn: 'PDF के रूप में निर्यात', exportSuccess: 'सहेजा गया!', empty: { title: 'यहाँ आपकी अंतर्दृष्टि बनेगी', body: 'भावनाएँ और प्रविष्टियाँ दर्ज करें।' }, last7: 'पिछले 7 दिन', chartLegend: 'प्रत्येक बिंदु उस दिन का औसत मूड', moodBreakdown: 'मूड विश्लेषण', streakMotiv: { week: 'अद्भुत! पूरा सप्ताह! 🌟', days: 'दिन लगातार!', sub: 'आप आत्म-देखभाल की आदत बना रहे हैं।' }, insights: { title: 'अंतर्दृष्टि', topMood: 'सबसे अधिक दर्ज किया गया मूड', trend: { label: 'मूड प्रवृत्ति', up: '↑ पिछले सप्ताह से बेहतर', down: '↓ पिछले सप्ताह से कम', flat: '→ पिछले सप्ताह जैसा', none: 'अधिक प्रविष्टियाँ करें' }, bestDay: 'सबसे अच्छा दिन', noPattern: 'पैटर्न देखने के लिए रोज़ लिखें' } },
  settingsScreen: { title: 'सेटिंग', clarityUnlock: 'Clarity अनलॉक', unlocked: '✓ अनलॉक हो गया', unlockTitle: 'पूरा Clarity खोलें', unlockPrice: '$4.99 · एकमुश्त भुगतान', unlockFeatures: ['पूर्ण भावना पहिया', 'असीमित इतिहास', 'PDF रिपोर्ट', 'भविष्य के मुझे पत्र', 'उन्नत पैटर्न', 'कस्टम टेम्पलेट'], unlockBtn: '$4.99 में अनलॉक करें', restoreBtn: 'खरीद पुनर्स्थापित करें', notifications: 'दैनिक अनुस्मारक', notificationsOff: 'बंद', notificationsOn: 'चालू', reminderTime: 'अनुस्मारक समय', reminderDays: 'दिन', appearance: 'रूप-रंग', themeSystem: 'सिस्टम', themeLight: 'हल्का', themeDark: 'गहरा', language: 'भाषा', data: 'आपका डेटा', exportData: 'सारा डेटा निर्यात करें (JSON)', deleteData: 'सारा डेटा हटाएँ', deleteConfirm: { title: 'सारा डेटा हटाएँ?', body: 'सभी डायरी, भावनाएँ और सेटिंग स्थायी रूप से हट जाएंगी।', confirm: 'सब हटाएँ', cancel: 'रद्द करें' }, privacy: 'गोपनीयता नीति', version: 'संस्करण', daysShort: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'], about: 'ऐप के बारे में', aboutBody: 'Clarity in Calm एक निजी ऑफलाइन वेलनेस ऐप है।' },
  journalExtended: { searchPlaceholder: 'प्रविष्टियाँ खोजें…', templates: 'टेम्पलेट', tags: 'टैग', addTag: '+ टैग जोड़ें', calendar: 'कैलेंडर', futureSelf: 'भविष्य का मैं', futureSelfTitle: 'भविष्य के मुझे लिखें', futureSelfSubtitle: 'इस पत्र को खोलने की तारीख चुनें', futureSelfLocked: 'खुलेगा', futureSelfUnlock: 'पत्र खोलें', unlockDate: 'खुलने की तारीख', setDate: 'तारीख सेट करें', templateFreeWrite: 'स्वतंत्र लेखन', templateGratitude: 'कृतज्ञता', templateReflection: 'दैनिक समीक्षा', templateCBT: 'विचार जाँच', templateWeeklyReview: 'साप्ताहिक समीक्षा', templateFutureSelf: 'भविष्य का मैं', noResults: 'कोई परिणाम नहीं', customTagPlaceholder: 'टैग…', addTagConfirm: 'जोड़ें', deleteEntry: 'हटाएँ' },
  progress: {
    title:    'प्रगति',
    subtitle: 'आपकी वेलनेस यात्रा',
    stats: {
      entries:  'डायरी प्रविष्टियाँ',
      sessions: 'साँस सत्र',
      avgMood:  'औसत मूड',
    },
    last7:        'पिछले 7 दिन',
    chartLegend:  'हर बिंदु उस दिन का औसत मूड दर्शाता है',
    streakHow:    'स्ट्रीक बढ़ाने के लिए हर दिन डायरी में प्रविष्टि करें',
    moodBreakdown: 'मूड विश्लेषण',
    streakMotiv: {
      week: 'अद्भुत! पूरा एक सप्ताह! 🌟',
      days: 'दिन लगातार!',
      sub:  'आप वास्तविक आत्म-देखभाल की आदत बना रहे हैं। जारी रखें — हर दिन मायने रखता है।',
    },
    empty: {
      title: 'अपनी यात्रा शुरू करें',
      body:  'अपना पहला मूड डायरी टैब में दर्ज करें और यहाँ अपनी प्रगति देखें।',
    },
    insights: {
      title:    'अंतर्दृष्टि',
      topMood:  'सबसे अधिक दर्ज किया गया मूड',
      trend: {
        label: 'मूड प्रवृत्ति',
        up:    '↑ पिछले सप्ताह से बेहतर',
        down:  '↓ पिछले सप्ताह से कम',
        flat:  '→ पिछले सप्ताह जैसा',
        none:  'प्रवृत्ति देखने के लिए अधिक प्रविष्टियाँ करें',
      },
      bestDay:   'आपका सबसे अच्छा दिन',
      noPattern: 'पैटर्न खोजने के लिए रोज़ लिखते रहें',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSLATIONS: Record<Locale, Translations> = { en, ko, es, hi };
