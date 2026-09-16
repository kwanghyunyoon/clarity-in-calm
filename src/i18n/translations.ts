/**
 * App-wide translations — English (en), Korean (ko), Spanish-LatAm (es), Hindi (hi)
 *
 * Every translated string/array lives once, in SOURCE, as a { en, ko, es, hi }
 * leaf — not duplicated across four parallel trees. TRANSLATIONS[locale] is
 * derived by walking SOURCE and picking one branch per leaf.
 *
 * Add a new string: add one leaf `{ en: '...', ko: '...', es: '...', hi: '...' }`
 * to SOURCE at the right nesting. TypeScript rejects a leaf missing any locale
 * (Locale-leaf types require all four); it does NOT check that two locale-leaf
 * arrays have the same length — see __tests__/TranslationArrayParity.test.ts.
 *
 * Mechanically migrated from the previous four-tree layout; see
 * __tests__/_migrate_dump.test.ts (deleted after migration) for the zip script,
 * which verified TRANSLATIONS.en/ko/es/hi deep-equal the pre-migration trees
 * before this file replaced them.
 */

export type Locale = 'en' | 'ko' | 'es' | 'hi';

const LOCALES: readonly Locale[] = ['en', 'ko', 'es', 'hi'];

/** A translated leaf: one value per locale. */
type LocaleLeaf<T> = { en: T; ko: T; es: T; hi: T };

/** Recursively replaces every LocaleLeaf<T> in a SOURCE tree with T — the resolved per-locale shape. */
type Delocalize<T> = T extends LocaleLeaf<infer V>
  ? V
  : T extends object
    ? { [K in keyof T]: Delocalize<T[K]> }
    : T;

function isLocaleLeaf(v: unknown): v is LocaleLeaf<unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    LOCALES.every(l => l in (v as Record<string, unknown>)) &&
    Object.keys(v as object).length === LOCALES.length
  );
}

function resolve<T>(node: T, locale: Locale): Delocalize<T> {
  if (isLocaleLeaf(node)) return (node as Record<Locale, unknown>)[locale] as Delocalize<T>;
  if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(node)) {
      out[key] = resolve((node as Record<string, unknown>)[key], locale);
    }
    return out as Delocalize<T>;
  }
  return node as unknown as Delocalize<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE — one leaf per translated string/array, all four locales together.
// ─────────────────────────────────────────────────────────────────────────────

export const SOURCE = {
  tabs: {
    home: {
      en: 'Home',
      ko: '홈',
      es: 'Inicio',
      hi: 'होम',
    },
    breathe: {
      en: 'Breathe',
      ko: '호흡',
      es: 'Respirar',
      hi: 'साँस',
    },
    journal: {
      en: 'Journal',
      ko: '일기',
      es: 'Diario',
      hi: 'डायरी',
    },
    today: {
      en: 'Today',
      ko: '오늘',
      es: 'Hoy',
      hi: 'आज',
    },
    emotions: {
      en: 'Emotions',
      ko: '감정',
      es: 'Emociones',
      hi: 'भावनाएँ',
    },
    insights: {
      en: 'Insights',
      ko: '분석',
      es: 'Análisis',
      hi: 'विश्लेषण',
    },
    settings: {
      en: 'Settings',
      ko: '설정',
      es: 'Ajustes',
      hi: 'सेटिंग',
    },
  },
  moods: {
    en: [
      {
        emoji: '😔',
        label: 'Rough',
        value: 1,
        color: '#E8B4BC',
      },
      {
        emoji: '😕',
        label: 'Low',
        value: 2,
        color: '#F2C4A0',
      },
      {
        emoji: '😐',
        label: 'Okay',
        value: 3,
        color: '#F5E6A0',
      },
      {
        emoji: '🙂',
        label: 'Good',
        value: 4,
        color: '#B8DBC0',
      },
      {
        emoji: '😄',
        label: 'Great',
        value: 5,
        color: '#A0C4D0',
      },
    ],
    ko: [
      {
        emoji: '😔',
        label: '힘들어요',
        value: 1,
        color: '#E8B4BC',
      },
      {
        emoji: '😕',
        label: '우울해요',
        value: 2,
        color: '#F2C4A0',
      },
      {
        emoji: '😐',
        label: '그냥 그래요',
        value: 3,
        color: '#F5E6A0',
      },
      {
        emoji: '🙂',
        label: '좋아요',
        value: 4,
        color: '#B8DBC0',
      },
      {
        emoji: '😄',
        label: '아주 좋아요',
        value: 5,
        color: '#A0C4D0',
      },
    ],
    es: [
      {
        emoji: '😔',
        label: 'Difícil',
        value: 1,
        color: '#E8B4BC',
      },
      {
        emoji: '😕',
        label: 'Bajo',
        value: 2,
        color: '#F2C4A0',
      },
      {
        emoji: '😐',
        label: 'Regular',
        value: 3,
        color: '#F5E6A0',
      },
      {
        emoji: '🙂',
        label: 'Bien',
        value: 4,
        color: '#B8DBC0',
      },
      {
        emoji: '😄',
        label: 'Genial',
        value: 5,
        color: '#A0C4D0',
      },
    ],
    hi: [
      {
        emoji: '😔',
        label: 'मुश्किल',
        value: 1,
        color: '#E8B4BC',
      },
      {
        emoji: '😕',
        label: 'उदास',
        value: 2,
        color: '#F2C4A0',
      },
      {
        emoji: '😐',
        label: 'ठीक है',
        value: 3,
        color: '#F5E6A0',
      },
      {
        emoji: '🙂',
        label: 'अच्छा',
        value: 4,
        color: '#B8DBC0',
      },
      {
        emoji: '😄',
        label: 'शानदार',
        value: 5,
        color: '#A0C4D0',
      },
    ],
  },
  install: {
    title: {
      en: 'Add to Home Screen',
      ko: '홈 화면에 추가하기',
      es: 'Agregar a la pantalla de inicio',
      hi: 'होम स्क्रीन पर जोड़ें',
    },
    bodyIos: {
      en: 'Tap the Share button (⬆) at the bottom of Safari, then choose \'Add to Home Screen\'.',
      ko: 'Safari 하단의 공유 버튼(⬆)을 탭한 후 \'홈 화면에 추가\'를 선택하세요.',
      es: 'Toca el botón Compartir (⬆) en Safari y elige \'Agregar a pantalla de inicio\'.',
      hi: 'Safari में नीचे Share बटन (⬆) टैप करें, फिर \'Add to Home Screen\' चुनें।',
    },
    bodyOther: {
      en: 'Install Clarity in Calm for instant access — no app store needed.',
      ko: 'Clarity in Calm을 설치하면 앱스토어 없이 바로 접근할 수 있어요.',
      es: 'Instala Clarity in Calm para acceso inmediato — sin tienda de aplicaciones.',
      hi: 'Clarity in Calm इंस्टॉल करें — ऐप स्टोर की ज़रूरत नहीं, सीधे एक्सेस करें।',
    },
    installBtn: {
      en: 'Install App',
      ko: '앱 설치',
      es: 'Instalar app',
      hi: 'ऐप इंस्टॉल करें',
    },
    dismiss: {
      en: 'Not now',
      ko: '나중에',
      es: 'Ahora no',
      hi: 'अभी नहीं',
    },
  },
  onboarding: {
    slides: {
      en: [
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
      ko: [
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
      es: [
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
      hi: [
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
    },
    next: {
      en: 'Next',
      ko: '다음',
      es: 'Siguiente',
      hi: 'आगे',
    },
    getStarted: {
      en: 'Let\'s go',
      ko: '시작하기',
      es: '¡Vamos!',
      hi: 'चलते हैं',
    },
    privacy: {
      en: '🔒 Your data never leaves your device',
      ko: '🔒 데이터는 절대 이 기기를 벗어나지 않아요',
      es: '🔒 Tus datos nunca abandonan tu dispositivo',
      hi: '🔒 आपका डेटा कभी भी इस डिवाइस से बाहर नहीं जाता',
    },
    reportIssue: {
      en: 'Report an issue',
      ko: '문제 신고하기',
      es: 'Reportar un problema',
      hi: 'समस्या रिपोर्ट करें',
    },
    shieldChecklist: {
      en: [
        'Entries are encrypted on your device',
        'Nothing is ever uploaded to a server',
        'No ads, no trackers, no analytics on your journal content',
        'You can export or delete everything, anytime',
      ],
      ko: [
        '기록은 기기에서 암호화돼요',
        '어떤 서버에도 업로드되지 않아요',
        '일기 내용에는 광고, 추적기, 분석 도구가 전혀 없어요',
        '언제든지 모든 데이터를 내보내거나 삭제할 수 있어요',
      ],
      es: [
        'Las entradas se cifran en tu dispositivo',
        'Nunca se suben a ningún servidor',
        'Sin anuncios, rastreadores ni análisis sobre el contenido de tu diario',
        'Puedes exportar o eliminar todo, en cualquier momento',
      ],
      hi: [
        'प्रविष्टियाँ आपके डिवाइस पर एन्क्रिप्ट की जाती हैं',
        'कुछ भी कभी किसी सर्वर पर अपलोड नहीं होता',
        'आपकी डायरी सामग्री पर कोई विज्ञापन, ट्रैकर या एनालिटिक्स नहीं',
        'आप कभी भी सब कुछ निर्यात या हटा सकते हैं',
      ],
    },
    replayOnboarding: {
      en: 'View onboarding again',
      ko: '온보딩 다시 보기',
      es: 'Ver la introducción de nuevo',
      hi: 'फिर से ऑनबोर्डिंग देखें',
    },
    languageStepTitle: {
      en: 'Choose your language',
      ko: '언어를 선택하세요',
      es: 'Elige tu idioma',
      hi: 'अपनी भाषा चुनें',
    },
    languageStepBody: {
      en: 'Pick the language you’d like to use.',
      ko: '사용하고 싶은 언어를 선택해주세요.',
      es: 'Selecciona el idioma que te gustaría usar.',
      hi: 'वह भाषा चुनें जिसका आप उपयोग करना चाहते हैं।',
    },
    pillTip: {
      en: '💡 Tip: You can switch languages anytime using the pill in the top-left corner.',
      ko: '💡 팁: 화면 왼쪽 상단의 알약 모양 버튼으로 언제든지 언어를 바꿀 수 있어요.',
      es: '💡 Consejo: puedes cambiar de idioma en cualquier momento con la píldora en la esquina superior izquierda.',
      hi: '💡 सुझाव: आप स्क्रीन के ऊपरी-बाएँ कोने में मौजूद पिल बटन से कभी भी भाषा बदल सकते हैं।',
    },
    continueLabel: {
      en: 'Continue',
      ko: '계속하기',
      es: 'Continuar',
      hi: 'जारी रखें',
    },
  },
  home: {
    greeting: {
      morning: {
        en: 'Good morning',
        ko: '좋은 아침이에요',
        es: 'Buenos días',
        hi: 'शुभ प्रभात',
      },
      afternoon: {
        en: 'Good afternoon',
        ko: '좋은 오후에요',
        es: 'Buenas tardes',
        hi: 'शुभ दोपहर',
      },
      evening: {
        en: 'Good evening',
        ko: '좋은 저녁이에요',
        es: 'Buenas noches',
        hi: 'शुभ संध्या',
      },
    },
    greetingEmoji: {
      en: '🌿',
      ko: '🌿',
      es: '🌿',
      hi: '🌿',
    },
    moodPrompt: {
      en: 'How are you feeling?',
      ko: '지금 기분이 어떠세요?',
      es: '¿Cómo te sientes?',
      hi: 'आप कैसा महसूस कर रहे हैं?',
    },
    moodToday: {
      en: '✅  Today\'s mood',
      ko: '✅  오늘의 기분',
      es: '✅  Estado de hoy',
      hi: '✅  आज का मूड',
    },
    startSession: {
      en: 'Start a session',
      ko: '세션 시작하기',
      es: 'Iniciar una sesión',
      hi: 'सत्र शुरू करें',
    },
    actions: {
      breatheTitle: {
        en: 'Breathe',
        ko: '호흡하기',
        es: 'Respirar',
        hi: 'साँस लेना',
      },
      breatheSub: {
        en: 'Box breathing · 4 min',
        ko: '박스 호흡 · 4분',
        es: 'Respiración caja · 4 min',
        hi: 'बॉक्स ब्रीदिंग · 4 मिनट',
      },
      journalTitle: {
        en: 'Journal',
        ko: '일기 쓰기',
        es: 'Diario',
        hi: 'डायरी',
      },
      journalSub: {
        en: 'Reflect & log mood',
        ko: '기분 기록하기',
        es: 'Reflexionar y registrar',
        hi: 'भावनाएँ लिखें',
      },
      groundTitle: {
        en: 'Ground',
        ko: '그라운딩',
        es: 'Enraizar',
        hi: 'ग्राउंड',
      },
      groundSub: {
        en: '5-4-3-2-1 · Reset now',
        ko: '5-4-3-2-1 · 지금 안정하기',
        es: '5-4-3-2-1 · Vuelve al presente',
        hi: '5-4-3-2-1 · अभी करें',
      },
    },
    progress: {
      title: {
        en: 'Your progress',
        ko: '나의 진행 상황',
        es: 'Tu progreso',
        hi: 'आपकी प्रगति',
      },
      streak: {
        en: 'day streak',
        ko: '일 연속',
        es: 'días seguidos',
        hi: 'दिन की स्ट्रीक',
      },
      entries: {
        en: 'entries',
        ko: '기록',
        es: 'registros',
        hi: 'प्रविष्टियाँ',
      },
      sessions: {
        en: 'sessions',
        ko: '세션',
        es: 'sesiones',
        hi: 'सत्र',
      },
    },
    streakHow: {
      en: 'Log a journal entry every day to grow your streak',
      ko: '매일 일기를 작성하면 연속 기록이 늘어나요',
      es: 'Registra una entrada en el diario cada día para aumentar tu racha',
      hi: 'स्ट्रीक बढ़ाने के लिए हर दिन डायरी में प्रविष्टि करें',
    },
    helpBtn: {
      en: 'Not sure where to go?',
      ko: '어디서 시작할지 모르겠어요?',
      es: '¿No sabes por dónde empezar?',
      hi: 'कहाँ जाएँ समझ नहीं आ रहा?',
    },
    moodUpdateHint: {
      en: 'Tap any mood to update',
      ko: '기분을 탭해서 수정하세요',
      es: 'Toca un estado de ánimo para actualizar',
      hi: 'अपडेट करने के लिए मूड टैप करें',
    },
    todayEntries: {
      en: 'Today\'s entries',
      ko: '오늘의 기록',
      es: 'Registros de hoy',
      hi: 'आज की प्रविष्टियाँ',
    },
    moreEntries: {
      en: 'more — open Journal to see all',
      ko: '개 더 있어요 — 일기 탭에서 모두 보기',
      es: 'más — abre el Diario para ver todo',
      hi: 'और — सभी देखने के लिए डायरी खोलें',
    },
    gettingStarted: {
      title: {
        en: 'Here\'s how to start',
        ko: '이렇게 시작하세요',
        es: '¿Por dónde empezar?',
        hi: 'शुरुआत कैसे करें',
      },
      steps: {
        en: [
          {
            emoji: '🌬️',
            label: 'Breathe',
            sub: 'Open the Breathe tab for a 4-minute calming session',
          },
          {
            emoji: '📖',
            label: 'Journal',
            sub: 'Log your mood and thoughts in the Journal tab',
          },
          {
            emoji: '✨',
            label: 'Progress',
            sub: 'See your patterns after your first journal entry',
          },
        ],
        ko: [
          {
            emoji: '🌬️',
            label: '호흡하기',
            sub: '4분 호흡 세션을 위해 호흡 탭을 열어보세요',
          },
          {
            emoji: '📖',
            label: '일기 쓰기',
            sub: '일기 탭에서 기분과 생각을 기록하세요',
          },
          {
            emoji: '✨',
            label: '진행 확인하기',
            sub: '첫 번째 기록 후 패턴을 확인해보세요',
          },
        ],
        es: [
          {
            emoji: '🌬️',
            label: 'Respirar',
            sub: 'Abre la pestaña Respirar para una sesión calmante de 4 minutos',
          },
          {
            emoji: '📖',
            label: 'Diario',
            sub: 'Registra tu estado de ánimo y pensamientos en la pestaña Diario',
          },
          {
            emoji: '✨',
            label: 'Progreso',
            sub: 'Ve tus patrones después de tu primera entrada en el diario',
          },
        ],
        hi: [
          {
            emoji: '🌬️',
            label: 'साँस लेना',
            sub: '4 मिनट के शांत सत्र के लिए साँस टैब खोलें',
          },
          {
            emoji: '📖',
            label: 'डायरी',
            sub: 'डायरी टैब में अपना मूड और विचार लिखें',
          },
          {
            emoji: '✨',
            label: 'प्रगति',
            sub: 'पहली प्रविष्टि के बाद यहाँ अपने पैटर्न देखें',
          },
        ],
      },
    },
  },
  breathe: {
    title: {
      en: 'Breathe',
      ko: '호흡',
      es: 'Respirar',
      hi: 'साँस लेना',
    },
    subtitle: {
      en: 'Box breathing · 4 – 4 – 4 – 4',
      ko: '박스 호흡 · 4 – 4 – 4 – 4',
      es: 'Respiración caja · 4 – 4 – 4 – 4',
      hi: 'बॉक्स ब्रीदिंग · 4 – 4 – 4 – 4',
    },
    phases: {
      inhale: {
        label: {
          en: 'Inhale',
          ko: '들이쉬기',
          es: 'Inhalar',
          hi: 'श्वास लें',
        },
        hint: {
          en: 'breathe in',
          ko: '천천히 들이쉬세요',
          es: 'respira profundo',
          hi: 'धीरे-धीरे साँस लें',
        },
      },
      hold1: {
        label: {
          en: 'Hold',
          ko: '참기',
          es: 'Sostener',
          hi: 'रोकें',
        },
        hint: {
          en: 'hold gently',
          ko: '부드럽게 참으세요',
          es: 'mantén suavemente',
          hi: 'हल्के से रोकें',
        },
      },
      exhale: {
        label: {
          en: 'Exhale',
          ko: '내쉬기',
          es: 'Exhalar',
          hi: 'छोड़ें',
        },
        hint: {
          en: 'breathe out',
          ko: '천천히 내쉬세요',
          es: 'suelta el aire',
          hi: 'धीरे-धीरे साँस छोड़ें',
        },
      },
      rest: {
        label: {
          en: 'Rest',
          ko: '쉬기',
          es: 'Descansar',
          hi: 'आराम',
        },
        hint: {
          en: 'let it settle',
          ko: '편안히 쉬세요',
          es: 'deja que se asiente',
          hi: 'शांत होने दें',
        },
      },
    },
    ready: {
      en: 'Ready',
      ko: '준비',
      es: 'Listo',
      hi: 'तैयार',
    },
    tapToStart: {
      en: 'tap Start to begin',
      ko: '시작을 눌러주세요',
      es: 'toca Iniciar para comenzar',
      hi: 'शुरू करने के लिए Start दबाएँ',
    },
    naturalBreath: {
      en: 'get comfortable and breathe naturally',
      ko: '편안한 자세로 자연스럽게 호흡하세요',
      es: 'ponte cómodo y respira naturalmente',
      hi: 'आराम से बैठें और स्वाभाविक रूप से साँस लें',
    },
    followCircle: {
      en: 'The circle guides each breath — watch it and breathe in sync.',
      ko: '원이 각 호흡을 안내해요 — 원을 바라보며 함께 호흡하세요.',
      es: 'El círculo guía cada respiración — obsérvalo y respira en sincronía.',
      hi: 'वृत्त हर साँस का मार्गदर्शन करता है — इसे देखें और इसके साथ साँस लें।',
    },
    round: {
      en: 'Round',
      ko: '라운드',
      es: 'Ronda',
      hi: 'राउंड',
    },
    endSession: {
      en: 'End session',
      ko: '세션 종료',
      es: 'Terminar sesión',
      hi: 'सत्र समाप्त करें',
    },
    startBreathing: {
      en: 'Start breathing',
      ko: '호흡 시작',
      es: 'Iniciar respiración',
      hi: 'साँस लेना शुरू करें',
    },
    infoText: {
      en: 'Box breathing activates your parasympathetic nervous system, reducing stress and improving focus. Each phase lasts 4 seconds.',
      ko: '박스 호흡은 부교감 신경계를 활성화하여 스트레스를 줄이고 집중력을 향상시킵니다. 각 단계는 4초입니다.',
      es: 'La respiración de caja activa tu sistema nervioso parasimpático, reduciendo el estrés y mejorando la concentración. Cada fase dura 4 segundos.',
      hi: 'बॉक्स ब्रीदिंग आपके पैरासिम्पेथेटिक नर्वस सिस्टम को सक्रिय करती है, तनाव कम करती है और एकाग्रता बढ़ाती है। प्रत्येक चरण 4 सेकंड का है।',
    },
  },
  ground: {
    title: {
      en: 'Grounding',
      ko: '그라운딩',
      es: 'Enraizamiento',
      hi: 'ग्राउंडिंग',
    },
    subtitle: {
      en: '5 – 4 – 3 – 2 – 1  ·  Back to now',
      ko: '5 – 4 – 3 – 2 – 1  ·  지금 이 순간으로',
      es: '5 – 4 – 3 – 2 – 1  ·  Regresa al presente',
      hi: '5 – 4 – 3 – 2 – 1  ·  अभी वापस आएँ',
    },
    intro: {
      en: 'Anxiety pulls you out of the present. This 2-minute exercise brings you back by engaging your senses one at a time.',
      ko: '불안은 당신을 현재에서 끌어냅니다. 이 2분짜리 운동은 감각을 하나씩 활성화하여 현재로 되돌려줘요.',
      es: 'La ansiedad te aleja del momento presente. Este ejercicio de 2 minutos te devuelve activando tus sentidos uno a uno.',
      hi: 'चिंता आपको वर्तमान से दूर ले जाती है। यह 2 मिनट का अभ्यास आपकी इंद्रियों को एक-एक करके जगाकर आपको वापस लाता है।',
    },
    steps: {
      en: [
        {
          count: 5,
          emoji: '👁️',
          sense: 'See',
          instruction: 'Name 5 things you can SEE',
          tip: 'Look around slowly — a wall, your hand, a window, a color, a shadow…',
        },
        {
          count: 4,
          emoji: '🤲',
          sense: 'Touch',
          instruction: 'Name 4 things you can TOUCH or FEEL',
          tip: 'Clothes on your skin, floor under your feet, the chair, air temperature…',
        },
        {
          count: 3,
          emoji: '👂',
          sense: 'Hear',
          instruction: 'Name 3 sounds you can HEAR',
          tip: 'Your breath, traffic, a fan, birds, the hum of silence…',
        },
        {
          count: 2,
          emoji: '👃',
          sense: 'Smell',
          instruction: 'Name 2 things you can SMELL',
          tip: 'Your drink, the air, soap, nearby food — or just take a slow breath…',
        },
        {
          count: 1,
          emoji: '👅',
          sense: 'Taste',
          instruction: 'Name 1 thing you can TASTE',
          tip: 'Water, gum, food — or simply notice the taste in your mouth right now…',
        },
      ],
      ko: [
        {
          count: 5,
          emoji: '👁️',
          sense: '보이는 것',
          instruction: '지금 볼 수 있는 것 5가지',
          tip: '천천히 주위를 살펴보세요 — 벽, 손, 창문, 색깔, 그림자…',
        },
        {
          count: 4,
          emoji: '🤲',
          sense: '느끼는 것',
          instruction: '몸으로 느낄 수 있는 것 4가지',
          tip: '바닥에 닿은 발, 옷감, 의자, 공기의 온도…',
        },
        {
          count: 3,
          emoji: '👂',
          sense: '들리는 것',
          instruction: '들을 수 있는 소리 3가지',
          tip: '숨소리, 차 소리, 선풍기, 새소리, 고요함의 소음…',
        },
        {
          count: 2,
          emoji: '👃',
          sense: '냄새',
          instruction: '맡을 수 있는 것 2가지',
          tip: '음료, 공기, 비누, 음식 — 아니면 천천히 숨을 들이마시세요…',
        },
        {
          count: 1,
          emoji: '👅',
          sense: '맛',
          instruction: '느낄 수 있는 맛 1가지',
          tip: '물, 껌, 음식 — 아니면 지금 입 안의 맛을 느껴보세요…',
        },
      ],
      es: [
        {
          count: 5,
          emoji: '👁️',
          sense: 'Ver',
          instruction: 'Nombra 5 cosas que puedas VER',
          tip: 'Mira lentamente — una pared, tu mano, una ventana, un color, una sombra…',
        },
        {
          count: 4,
          emoji: '🤲',
          sense: 'Sentir',
          instruction: 'Nombra 4 cosas que puedas TOCAR o SENTIR',
          tip: 'La ropa en tu piel, el suelo bajo tus pies, la silla, la temperatura del aire…',
        },
        {
          count: 3,
          emoji: '👂',
          sense: 'Escuchar',
          instruction: 'Nombra 3 sonidos que puedas ESCUCHAR',
          tip: 'Tu respiración, el tráfico, un ventilador, pájaros, el silencio…',
        },
        {
          count: 2,
          emoji: '👃',
          sense: 'Oler',
          instruction: 'Nombra 2 cosas que puedas OLER',
          tip: 'Tu bebida, el aire, jabón, comida cercana — o toma una respiración lenta…',
        },
        {
          count: 1,
          emoji: '👅',
          sense: 'Saborear',
          instruction: 'Nombra 1 cosa que puedas SABOREAR',
          tip: 'Agua, chicle, comida — o simplemente nota el sabor en tu boca ahora mismo…',
        },
      ],
      hi: [
        {
          count: 5,
          emoji: '👁️',
          sense: 'देखना',
          instruction: '5 चीज़ें जो आप देख सकते हैं',
          tip: 'धीरे-धीरे चारों ओर देखें — एक दीवार, आपका हाथ, खिड़की, कोई रंग, छाया…',
        },
        {
          count: 4,
          emoji: '🤲',
          sense: 'महसूस करना',
          instruction: '4 चीज़ें जो आप छू सकते हैं या महसूस कर सकते हैं',
          tip: 'कपड़ों का अहसास, पैरों तले फर्श, कुर्सी, हवा का तापमान…',
        },
        {
          count: 3,
          emoji: '👂',
          sense: 'सुनना',
          instruction: '3 आवाज़ें जो आप सुन सकते हैं',
          tip: 'अपनी साँस, वाहनों की आवाज़, पंखा, पक्षी, खामोशी की गूँज…',
        },
        {
          count: 2,
          emoji: '👃',
          sense: 'सूँघना',
          instruction: '2 चीज़ें जो आप सूँघ सकते हैं',
          tip: 'आपका पेय, हवा, साबुन, पास का खाना — या धीरे से साँस लें…',
        },
        {
          count: 1,
          emoji: '👅',
          sense: 'स्वाद',
          instruction: '1 चीज़ जो आप स्वाद में महसूस कर सकते हैं',
          tip: 'पानी, गम, खाना — या बस अभी मुँह के स्वाद पर ध्यान दें…',
        },
      ],
    },
    next: {
      en: 'Next',
      ko: '다음',
      es: 'Siguiente',
      hi: 'अगला',
    },
    done: {
      en: 'Done',
      ko: '완료',
      es: 'Listo',
      hi: 'हो गया',
    },
    complete: {
      emoji: {
        en: '🌿',
        ko: '🌿',
        es: '🌿',
        hi: '🌿',
      },
      title: {
        en: 'You\'re present',
        ko: '지금 여기에 있어요',
        es: 'Estás presente',
        hi: 'आप वर्तमान में हैं',
      },
      body: {
        en: 'Your nervous system has been brought back to now. Take one slow breath and carry this calm with you.',
        ko: '신경계가 현재 순간으로 돌아왔어요. 천천히 한 번 숨을 쉬고, 이 평온함을 이어가세요.',
        es: 'Tu sistema nervioso ha vuelto al momento presente. Respira hondo una vez y lleva esta calma contigo.',
        hi: 'आपका तंत्रिका तंत्र वर्तमान क्षण में वापस आ गया। एक धीमी साँस लें और यह शांति अपने साथ रखें।',
      },
      again: {
        en: 'Run again',
        ko: '다시 하기',
        es: 'Repetir',
        hi: 'फिर करें',
      },
      back: {
        en: 'Back to Home',
        ko: '홈으로',
        es: 'Volver al inicio',
        hi: 'होम पर वापस',
      },
    },
    infoText: {
      en: 'The 5-4-3-2-1 technique interrupts anxious thought spirals by activating your senses. Widely used by therapists worldwide — and it costs nothing.',
      ko: '5-4-3-2-1 기법은 감각을 활성화해 불안한 생각의 소용돌이를 끊어줘요. 전 세계 치료사들이 활용하는 방법이고, 아무런 도구도 필요 없어요.',
      es: 'La técnica 5-4-3-2-1 interrumpe las espirales de ansiedad activando tus sentidos. Utilizada por terapeutas en todo el mundo — y no cuesta nada.',
      hi: '5-4-3-2-1 तकनीक आपकी इंद्रियों को सक्रिय करके चिंता के चक्र को तोड़ती है। दुनिया भर के थेरेपिस्ट इसका उपयोग करते हैं — और इसके लिए कुछ भी चाहिए नहीं।',
    },
  },
  journal: {
    title: {
      en: 'Journal',
      ko: '일기',
      es: 'Diario',
      hi: 'डायरी',
    },
    subtitle: {
      en: 'How are you feeling right now?',
      ko: '지금 기분이 어떠세요?',
      es: '¿Cómo te sientes ahora mismo?',
      hi: 'अभी आप कैसा महसूस कर रहे हैं?',
    },
    safeSpace: {
      title: {
        en: 'This is your private space',
        ko: '이곳은 당신만의 공간이에요',
        es: 'Este es tu espacio privado',
        hi: 'यह आपका निजी स्थान है',
      },
      body: {
        en: 'No one else can see what you write here — not us, not anyone. Say exactly what\'s on your mind, unfiltered. There\'s no wrong way to feel.',
        ko: '여기에 쓰는 내용은 아무도 볼 수 없어요 — 우리도, 누구도요. 필터 없이 솔직하게 마음을 털어놓으세요. 어떤 감정이든 틀린 것은 없어요.',
        es: 'Nadie más puede ver lo que escribes aquí — ni nosotros ni nadie. Di exactamente lo que tienes en mente, sin filtros. No hay forma incorrecta de sentir.',
        hi: 'यहाँ आप जो लिखते हैं वह कोई नहीं देख सकता — न हम, न कोई और। बिना किसी फ़िल्टर के अपने मन की बात लिखें। कोई भी भावना गलत नहीं है।',
      },
    },
    moodLabel: {
      en: 'Mood',
      ko: '기분',
      es: 'Estado de ánimo',
      hi: 'मूड',
    },
    reflectionLabel: {
      en: 'Reflection',
      ko: '오늘의 생각',
      es: 'Reflexión',
      hi: 'विचार',
    },
    optionalLabel: {
      en: '(optional)',
      ko: '(선택사항)',
      es: '(opcional)',
      hi: '(वैकल्पिक)',
    },
    placeholder: {
      en: 'Write freely…',
      ko: '자유롭게 써보세요…',
      es: 'Escribe libremente…',
      hi: 'स्वतंत्र रूप से लिखें…',
    },
    prompts: {
      en: [
        'What made you smile today?',
        'One thing you\'re grateful for right now…',
        'What felt heavy today?',
        'A small win worth celebrating…',
        'How does your body feel right now?',
      ],
      ko: [
        '오늘 어떤 일이 미소 짓게 했나요?',
        '지금 감사한 것 한 가지...',
        '오늘 힘들었던 일은 무엇인가요?',
        '오늘 칭찬받을 만한 작은 성취...',
        '지금 몸 상태는 어떤가요?',
      ],
      es: [
        '¿Qué te hizo sonreír hoy?',
        'Una cosa por la que estás agradecido/a ahora…',
        '¿Qué se sintió pesado hoy?',
        'Un pequeño logro que vale la pena celebrar…',
        '¿Cómo se siente tu cuerpo ahora mismo?',
      ],
      hi: [
        'आज आपको किस बात ने मुस्कुराया?',
        'अभी एक चीज़ जिसके लिए आप आभारी हैं…',
        'आज क्या भारी लगा?',
        'एक छोटी सफलता जो मनाने लायक है…',
        'अभी आपका शरीर कैसा महसूस कर रहा है?',
      ],
    },
    saveBtn: {
      en: 'Save entry',
      ko: '저장하기',
      es: 'Guardar entrada',
      hi: 'प्रविष्टि सहेजें',
    },
    savedBtn: {
      en: '✓  Saved!',
      ko: '✓  저장됨!',
      es: '✓  ¡Guardado!',
      hi: '✓  सहेजा गया!',
    },
    pastTitle: {
      en: 'Past entries',
      ko: '이전 기록',
      es: 'Entradas anteriores',
      hi: 'पिछली प्रविष्टियाँ',
    },
    emptyTitle: {
      en: 'Your entries will appear here. Start by logging how you feel today.',
      ko: '기록이 여기에 나타납니다. 지금 기분을 기록해보세요.',
      es: 'Tus entradas aparecerán aquí. Comienza registrando cómo te sientes hoy.',
      hi: 'आपकी प्रविष्टियाँ यहाँ दिखेंगी। आज अपनी भावनाएँ लिखकर शुरू करें।',
    },
    crisis: {
      title: {
        en: 'You\'re not alone',
        ko: '혼자가 아니에요',
        es: 'No estás solo/a',
        hi: 'आप अकेले नहीं हैं',
      },
      body: {
        en: 'It sounds like you might be going through something really heavy right now. That takes courage to write down.\n\nIf you\'re having thoughts of suicide or self-harm, please reach out — someone is ready to listen right now.',
        ko: '지금 많이 힘드신 것 같아요. 이렇게 솔직하게 쓰신 것만으로도 정말 용감한 일이에요.\n\n자해나 자살에 대한 생각이 드신다면, 지금 바로 도움을 받으세요 — 언제든지 들어줄 준비가 되어 있어요.',
        es: 'Parece que estás pasando por algo muy difícil ahora mismo. Escribirlo ya es un acto de valentía.\n\nSi tienes pensamientos de suicidio o autolesión, por favor comunícate — alguien está listo para escucharte ahora mismo.',
        hi: 'ऐसा लगता है कि आप अभी कुछ बहुत भारी से गुज़र रहे हैं। यह लिखना साहस का काम है।\n\nअगर आपके मन में आत्महत्या या खुद को नुकसान पहुँचाने के विचार आ रहे हैं, तो कृपया संपर्क करें — कोई अभी सुनने के लिए तैयार है।',
      },
      lines: {
        en: [
          {
            emoji: '📞',
            title: '988 Suicide & Crisis Lifeline',
            sub: 'Call or text 988 · Free, confidential, 24/7',
            action: 'tel:988',
          },
          {
            emoji: '💬',
            title: 'Crisis Text Line',
            sub: 'Text HOME to 741741 · Free, 24/7',
            action: 'sms:741741?body=HOME',
          },
          {
            emoji: '🌍',
            title: 'International helplines',
            sub: 'findahelpline.com · Resources worldwide',
            action: 'https://findahelpline.com',
          },
        ],
        ko: [
          {
            emoji: '📞',
            title: '자살예방상담전화 1393',
            sub: '24시간, 무료, 비밀 보장',
            action: 'tel:1393',
          },
          {
            emoji: '💙',
            title: '정신건강 위기상담전화 1577-0199',
            sub: '24시간, 무료',
            action: 'tel:15770199',
          },
          {
            emoji: '🌿',
            title: '생명의전화 1588-9191',
            sub: '24시간, 무료',
            action: 'tel:15889191',
          },
        ],
        es: [
          {
            emoji: '📞',
            title: 'Línea de la Vida (México)',
            sub: '800 911 2000 · Gratuito, 24/7',
            action: 'tel:8009112000',
          },
          {
            emoji: '💬',
            title: 'SAPTEL (México)',
            sub: '55 5259-8121 · Gratuito, 24/7',
            action: 'tel:5552598121',
          },
          {
            emoji: '📞',
            title: 'Línea 192, opción 4 (Colombia)',
            sub: '192, opción 4 · Gratuito, 24/7',
            action: 'tel:192,4',
          },
          {
            emoji: '📞',
            title: 'Línea Nacional de Salud Mental (Argentina)',
            sub: '0800-999-0091 · Gratuito, 24/7',
            action: 'tel:08009990091',
          },
          {
            emoji: '📞',
            title: 'Línea 113, opción 5 (Perú)',
            sub: '113, opción 5 · Gratuito, 24/7',
            action: 'tel:113,5',
          },
          {
            emoji: '🌍',
            title: 'Líneas de ayuda internacionales',
            sub: 'findahelpline.com · Recursos en todo el mundo',
            action: 'https://findahelpline.com',
          },
        ],
        hi: [
          {
            emoji: '📞',
            title: 'iCall: 9152987821',
            sub: 'सोम–शनि, सुबह 8 – रात 10 बजे',
            action: 'tel:9152987821',
          },
          {
            emoji: '💬',
            title: 'Vandrevala Foundation: 1860-2662-345',
            sub: '24/7, निःशुल्क',
            action: 'tel:18602662345',
          },
          {
            emoji: '🌍',
            title: 'अंतर्राष्ट्रीय हेल्पलाइन',
            sub: 'findahelpline.com · दुनिया भर के संसाधन',
            action: 'https://findahelpline.com',
          },
        ],
      },
      confirmBtn: {
        en: 'I\'ll reach out for help',
        ko: '도움을 받겠습니다',
        es: 'Buscaré ayuda',
        hi: 'मैं मदद लूँगा / लूँगी',
      },
      saveBtn: {
        en: 'Save my entry anyway',
        ko: '그래도 저장하기',
        es: 'Guardar mi entrada de todas formas',
        hi: 'फिर भी मेरी प्रविष्टि सहेजें',
      },
    },
    crisisKeywords: {
      suicidalIdeation: {
        en: [
          'suicide',
          'suicidal',
          'kill myself',
          'end my life',
          'take my life',
          'want to die',
          'wanted to die',
        ],
        ko: [
          '자살',
          '자살하고 싶다',
          '자살하고싶다',
          '죽고 싶다',
          '죽고싶다',
          '죽어버리고 싶다',
          '죽고 싶어',
          '목숨을 끊다',
          '스스로 목숨을 끊다',
          '죽겠다',
          '죽을 것 같다',
        ],
        es: [
          'suicidio',
          'suicida',
          'matarme',
          'terminar con mi vida',
          'quitarme la vida',
          'quiero morir',
        ],
        hi: [
          'आत्महत्या',
          'खुदकुशी',
          'मरना चाहता हूँ',
          'मरना चाहती हूँ',
          'मर जाना चाहता हूँ',
          'आत्मघात',
        ],
      },
      hopelessness: {
        en: [
          'don\'t want to live',
          'dont want to live',
          'no reason to live',
          'better off dead',
          'better off without me',
          'not worth living',
        ],
        ko: [
          '살기 싫다',
          '살기싫다',
          '살고 싶지 않다',
          '더 이상 살고 싶지 않다',
          '죽는 게 낫다',
        ],
        es: [
          'no quiero vivir',
          'sin razón para vivir',
          'mejor muerto',
          'mejor muerta',
          'mejor sin mí',
          'no vale la pena vivir',
        ],
        hi: [
          'जीना नहीं चाहता',
          'जीना नहीं चाहती',
        ],
      },
      givingUp: {
        en: [
          'can\'t go on',
          'cant go on',
          'ending it',
          'end it all',
        ],
        ko: [
          '삶을 끝내고 싶다',
          '삶을 포기',
          '삶을 포기하고 싶다',
          '사라지고 싶다',
        ],
        es: [
          'no puedo más',
          'acabar con todo',
          'desaparecer para siempre',
        ],
        hi: [
          'जिंदगी खत्म करना',
          'सब छोड़ देना चाहता हूँ',
          'सब छोड़ देना चाहती हूँ',
          'गायब हो जाना चाहता हूँ',
          'गायब हो जाना चाहती हूँ',
        ],
      },
      selfHarm: {
        en: [
          'hurt myself',
          'self harm',
          'self-harm',
          'cutting myself',
        ],
        ko: [
          '자해',
          '스스로를 해치다',
          '스스로 해치고 싶다',
        ],
        es: [
          'hacerme daño',
          'autolesión',
          'autolesionarme',
          'cortarme',
        ],
        hi: [
          'खुद को नुकसान',
          'खुद को चोट',
        ],
      },
      overdose: {
        en: [
          'overdose',
        ],
        ko: [
          '약물 과다복용',
          '과다복용',
        ],
        es: [
          'sobredosis',
        ],
        hi: [
          'दवा की अधिक मात्रा',
          'ओवरडोज़',
        ],
      },
    },
    deleteConfirm: {
      title: {
        en: 'Delete entry?',
        ko: '기록을 삭제할까요?',
        es: '¿Eliminar entrada?',
        hi: 'प्रविष्टि हटाएँ?',
      },
      body: {
        en: 'This will permanently remove the entry.',
        ko: '이 기록은 영구적으로 삭제됩니다.',
        es: 'Esta entrada se eliminará de forma permanente.',
        hi: 'यह प्रविष्टि स्थायी रूप से हट जाएगी।',
      },
      confirm: {
        en: 'Delete',
        ko: '삭제',
        es: 'Eliminar',
        hi: 'हटाएँ',
      },
      cancel: {
        en: 'Cancel',
        ko: '취소',
        es: 'Cancelar',
        hi: 'रद्द करें',
      },
    },
  },
  today: {
    title: {
      en: 'Today',
      ko: '오늘',
      es: 'Hoy',
      hi: 'आज',
    },
    checkIn: {
      en: 'How are you right now?',
      ko: '지금 기분이 어떠세요?',
      es: '¿Cómo te sientes ahora?',
      hi: 'अभी कैसा महसूस कर रहे हैं?',
    },
    logEmotion: {
      en: 'Log emotion',
      ko: '감정 기록',
      es: 'Registrar emoción',
      hi: 'भावना दर्ज करें',
    },
    streakDays: {
      en: 'day streak',
      ko: '일 연속',
      es: 'días seguidos',
      hi: 'दिन लगातार',
    },
    streakStart: {
      en: 'Start your streak — log an emotion today',
      ko: '오늘 감정을 기록해 스트릭을 시작하세요',
      es: 'Registra una emoción hoy para comenzar tu racha',
      hi: 'स्ट्रीक शुरू करने के लिए आज भावना दर्ज करें',
    },
    tools: {
      en: 'Quick tools',
      ko: '빠른 도구',
      es: 'Herramientas rápidas',
      hi: 'त्वरित उपकरण',
    },
    breatheTitle: {
      en: 'Box Breathing',
      ko: '박스 호흡',
      es: 'Respiración de caja',
      hi: 'बॉक्स ब्रीदिंग',
    },
    breatheSub: {
      en: '4-4-4-4 · Calm your nervous system',
      ko: '4-4-4-4 · 신경계 안정',
      es: '4-4-4-4 · Calma tu sistema nervioso',
      hi: '4-4-4-4 · तंत्रिका तंत्र को शांत करें',
    },
    groundTitle: {
      en: '5-4-3-2-1 Grounding',
      ko: '5-4-3-2-1 그라운딩',
      es: 'Enraizamiento 5-4-3-2-1',
      hi: '5-4-3-2-1 ग्राउंडिंग',
    },
    groundSub: {
      en: 'Anchor to the present moment',
      ko: '현재 순간에 집중하기',
      es: 'Ancla al momento presente',
      hi: 'वर्तमान क्षण से जुड़ें',
    },
    todayEmotions: {
      en: 'Today\'s emotions',
      ko: '오늘의 감정',
      es: 'Emociones de hoy',
      hi: 'आज की भावनाएँ',
    },
    noEmotionsYet: {
      en: 'No emotions logged yet today',
      ko: '오늘 아직 기록된 감정이 없어요',
      es: 'No has registrado emociones hoy',
      hi: 'आज अभी कोई भावना दर्ज नहीं हुई',
    },
    quote: {
      en: 'Daily reflection',
      ko: '오늘의 명언',
      es: 'Reflexión diaria',
      hi: 'दैनिक विचार',
    },
    journalEntries: {
      en: 'journal\nentries',
      ko: '일기\n기록',
      es: 'entradas\nde diario',
      hi: 'डायरी\nप्रविष्टियाँ',
    },
    emotionsLogged: {
      en: 'emotions\nlogged',
      ko: '감정\n기록',
      es: 'emociones\nregistradas',
      hi: 'भावनाएँ\nदर्ज',
    },
  },
  emotionsScreen: {
    title: {
      en: 'Emotions',
      ko: '감정',
      es: 'Emociones',
      hi: 'भावनाएँ',
    },
    subtitle: {
      en: 'What are you feeling?',
      ko: '지금 어떤 감정인가요?',
      es: '¿Qué estás sintiendo?',
      hi: 'अभी क्या महसूस हो रहा है?',
    },
    selectEmotion: {
      en: 'Tap how you\'re feeling',
      ko: '지금 느끼는 감정을 탭하세요',
      es: 'Toca cómo te sientes',
      hi: 'अपनी भावना पर टैप करें',
    },
    intensity: {
      en: 'Intensity',
      ko: '강도',
      es: 'Intensidad',
      hi: 'तीव्रता',
    },
    intensityLow: {
      en: 'mild',
      ko: '약함',
      es: 'leve',
      hi: 'हल्का',
    },
    intensityHigh: {
      en: 'intense',
      ko: '강함',
      es: 'intensa',
      hi: 'तीव्र',
    },
    contextTags: {
      en: 'What\'s happening?',
      ko: '지금 무슨 상황인가요?',
      es: '¿Qué está pasando?',
      hi: 'अभी क्या हो रहा है?',
    },
    bodyCheckIn: {
      en: 'Where do you feel it?',
      ko: '어디서 느껴지나요?',
      es: '¿Dónde lo sientes?',
      hi: 'कहाँ महसूस हो रहा है?',
    },
    copingActions: {
      en: 'What did you do?',
      ko: '어떻게 했나요?',
      es: '¿Qué hiciste?',
      hi: 'आपने क्या किया?',
    },
    note: {
      en: 'Add a note (optional)',
      ko: '노트 추가 (선택사항)',
      es: 'Agrega una nota (opcional)',
      hi: 'नोट जोड़ें (वैकल्पिक)',
    },
    notePlaceholder: {
      en: 'Any thoughts about this feeling…',
      ko: '이 감정에 대한 생각…',
      es: 'Tus pensamientos sobre este sentimiento…',
      hi: 'इस भावना के बारे में विचार…',
    },
    saveBtn: {
      en: 'Log emotion',
      ko: '감정 기록하기',
      es: 'Registrar emoción',
      hi: 'भावना दर्ज करें',
    },
    savedBtn: {
      en: '✓ Logged!',
      ko: '✓ 저장됨!',
      es: '✓ ¡Registrado!',
      hi: '✓ दर्ज हो गया!',
    },
    pastTitle: {
      en: 'Recent emotions',
      ko: '최근 감정',
      es: 'Emociones recientes',
      hi: 'हाल की भावनाएँ',
    },
    emptyTitle: {
      en: 'Your emotion logs will appear here',
      ko: '감정 기록이 여기 나타납니다',
      es: 'Tus registros aparecerán aquí',
      hi: 'आपकी भावनाएँ यहाँ दिखेंगी',
    },
    emptyBody: {
      en: 'Tap an emotion above to log your first one',
      ko: '위에서 감정을 탭해 첫 감정을 기록하세요',
      es: 'Toca una emoción arriba para registrar la primera',
      hi: 'पहली भावना दर्ज करने के लिए ऊपर टैप करें',
    },
    otherPill: {
      en: '+ Other',
      ko: '+ 기타',
      es: '+ Otro',
      hi: '+ अन्य',
    },
    customPlaceholder: {
      en: 'Type how you feel…',
      ko: '느끼는 감정을 입력하세요…',
      es: 'Escribe cómo te sientes…',
      hi: 'अपनी भावना लिखें…',
    },
    quickLog: {
      en: 'Quick log',
      ko: '빠른 기록',
      es: 'Registro rápido',
      hi: 'त्वरित लॉग',
    },
    fullLog: {
      en: 'Full log',
      ko: '전체 기록',
      es: 'Registro completo',
      hi: 'पूर्ण लॉग',
    },
    selectedEmotion: {
      en: 'Selected',
      ko: '선택됨',
      es: 'Seleccionado',
      hi: 'चुना गया',
    },
    // Keyed by the raw values in PREDEFINED_CONTEXT_TAGS (src/constants/emotions.ts) —
    // these were previously mislabeled with journal.tsx's tag vocabulary (work/home/
    // family/...), which never matched a PREDEFINED_CONTEXT_TAGS value, so every
    // context-tag chip silently rendered its raw English tag in every locale.
    contextTagLabels: {
      morning: {
        en: 'Morning',
        ko: '아침',
        es: 'Mañana',
        hi: 'सुबह',
      },
      afternoon: {
        en: 'Afternoon',
        ko: '오후',
        es: 'Tarde',
        hi: 'दोपहर',
      },
      evening: {
        en: 'Evening',
        ko: '저녁',
        es: 'Noche',
        hi: 'शाम',
      },
      night: {
        en: 'Night',
        ko: '밤',
        es: 'Madrugada',
        hi: 'रात',
      },
      'at work': {
        en: 'At work',
        ko: '직장에서',
        es: 'En el trabajo',
        hi: 'काम पर',
      },
      'at home': {
        en: 'At home',
        ko: '집에서',
        es: 'En casa',
        hi: 'घर पर',
      },
      commuting: {
        en: 'Commuting',
        ko: '통근 중',
        es: 'En camino',
        hi: 'आने-जाने के दौरान',
      },
      outdoors: {
        en: 'Outdoors',
        ko: '야외에서',
        es: 'Al aire libre',
        hi: 'बाहर',
      },
      'with family': {
        en: 'With family',
        ko: '가족과 함께',
        es: 'Con la familia',
        hi: 'परिवार के साथ',
      },
      'with friends': {
        en: 'With friends',
        ko: '친구와 함께',
        es: 'Con amigos',
        hi: 'दोस्तों के साथ',
      },
      alone: {
        en: 'Alone',
        ko: '혼자',
        es: 'A solas',
        hi: 'अकेले',
      },
      'in a crowd': {
        en: 'In a crowd',
        ko: '사람들 속에서',
        es: 'Entre mucha gente',
        hi: 'भीड़ में',
      },
      'after news': {
        en: 'After news',
        ko: '뉴스를 본 후',
        es: 'Después de ver noticias',
        hi: 'समाचार देखने के बाद',
      },
      'social media': {
        en: 'Social media',
        ko: '소셜 미디어',
        es: 'Redes sociales',
        hi: 'सोशल मीडिया',
      },
      'after argument': {
        en: 'After argument',
        ko: '다툼 후',
        es: 'Después de una discusión',
        hi: 'बहस के बाद',
      },
      'before big event': {
        en: 'Before big event',
        ko: '중요한 일 전',
        es: 'Antes de un evento importante',
        hi: 'बड़े कार्यक्रम से पहले',
      },
      tired: {
        en: 'Tired',
        ko: '피곤함',
        es: 'Cansancio',
        hi: 'थकान',
      },
      hungry: {
        en: 'Hungry',
        ko: '배고픔',
        es: 'Hambre',
        hi: 'भूख',
      },
      sick: {
        en: 'Sick',
        ko: '아픔',
        es: 'Enfermo/a',
        hi: 'बीमार',
      },
      'after exercise': {
        en: 'After exercise',
        ko: '운동 후',
        es: 'Después de hacer ejercicio',
        hi: 'व्यायाम के बाद',
      },
      'poor sleep': {
        en: 'Poor sleep',
        ko: '수면 부족',
        es: 'Dormí mal',
        hi: 'नींद कम आई',
      },
      'good sleep': {
        en: 'Good sleep',
        ko: '숙면',
        es: 'Dormí bien',
        hi: 'अच्छी नींद आई',
      },
    },
    deleteConfirm: {
      title: {
        en: 'Delete emotion log?',
        ko: '감정 기록 삭제?',
        es: '¿Eliminar registro?',
        hi: 'भावना लॉग हटाएँ?',
      },
      body: {
        en: 'This will permanently remove this entry.',
        ko: '이 항목이 영구적으로 삭제됩니다.',
        es: 'Este registro se eliminará de forma permanente.',
        hi: 'यह प्रविष्टि स्थायी रूप से हट जाएगी।',
      },
      confirm: {
        en: 'Delete',
        ko: '삭제',
        es: 'Eliminar',
        hi: 'हटाएँ',
      },
      cancel: {
        en: 'Cancel',
        ko: '취소',
        es: 'Cancelar',
        hi: 'रद्द करें',
      },
    },
  },
  feelingsLibraryScreen: {
    title: {
      en: 'Feelings Library',
      ko: '감정 라이브러리',
      es: 'Biblioteca de Emociones',
      hi: 'भावना पुस्तकालय',
    },
    subtitle: {
      en: 'Notice it, hear it, ease it',
      ko: '알아차리고, 듣고, 편안하게',
      es: 'Nótalo, escúchalo, calma',
      hi: 'महसूस करें, सुनें, सहज बनें',
    },
    cardTitle: {
      en: 'Feelings Library',
      ko: '감정 라이브러리',
      es: 'Biblioteca de Emociones',
      hi: 'भावना पुस्तकालय',
    },
    cardSub: {
      en: 'Explore 8 common feelings',
      ko: '8가지 감정 탐색하기',
      es: 'Explora 8 emociones comunes',
      hi: '8 सामान्य भावनाएँ जानें',
    },
    back: {
      en: 'Back',
      ko: '뒤로',
      es: 'Atrás',
      hi: 'वापस',
    },
    noticeLabel: {
      en: 'Notice',
      ko: '알아차리기',
      es: 'Notar',
      hi: 'महसूस करें',
    },
    hearLabel: {
      en: 'Hear',
      ko: '듣기',
      es: 'Escuchar',
      hi: 'सुनें',
    },
    feelLabel: {
      en: 'Feel',
      ko: '느끼기',
      es: 'Sentir',
      hi: 'अनुभव',
    },
    easeLabel: {
      en: 'Ease',
      ko: '편안하게',
      es: 'Calmar',
      hi: 'सहज बनें',
    },
    exploreLabel: {
      en: 'Explore',
      ko: '탐구하기',
      es: 'Explorar',
      hi: 'जानें',
    },
    affirmationLabel: {
      en: 'Based on how you\'re feeling',
      ko: '지금 느끼는 감정에 맞춰',
      es: 'Según cómo te sientes',
      hi: 'आपकी भावना के अनुसार',
    },
  },
  insightsScreen: {
    title: {
      en: 'Insights',
      ko: '분석',
      es: 'Análisis',
      hi: 'विश्लेषण',
    },
    subtitle: {
      en: 'Your patterns over time',
      ko: '시간에 따른 패턴',
      es: 'Tus patrones en el tiempo',
      hi: 'समय के साथ आपके पैटर्न',
    },
    monthlyReport: {
      en: 'This month',
      ko: '이번 달',
      es: 'Este mes',
      hi: 'इस महीने',
    },
    totalEntries: {
      en: 'journal entries',
      ko: '일기 기록',
      es: 'entradas de diario',
      hi: 'डायरी प्रविष्टियाँ',
    },
    totalEmotions: {
      en: 'emotions logged',
      ko: '감정 기록',
      es: 'emociones registradas',
      hi: 'भावनाएँ दर्ज',
    },
    avgIntensity: {
      en: 'avg intensity',
      ko: '평균 강도',
      es: 'intensidad promedio',
      hi: 'औसत तीव्रता',
    },
    topEmotion: {
      en: 'Most felt',
      ko: '가장 많이 느낀 감정',
      es: 'Más sentida',
      hi: 'सबसे अधिक महसूस की गई',
    },
    topTrigger: {
      en: 'Top trigger',
      ko: '주요 트리거',
      es: 'Principal desencadenante',
      hi: 'मुख्य ट्रिगर',
    },
    streakRecord: {
      en: 'Best streak',
      ko: '최고 스트릭',
      es: 'Mejor racha',
      hi: 'सर्वश्रेष्ठ स्ट्रीक',
    },
    timeOfDay: {
      en: 'Time of day',
      ko: '시간대',
      es: 'Momento del día',
      hi: 'दिन का समय',
    },
    morning: {
      en: 'Morning',
      ko: '아침',
      es: 'Mañana',
      hi: 'सुबह',
    },
    afternoon: {
      en: 'Afternoon',
      ko: '오후',
      es: 'Tarde',
      hi: 'दोपहर',
    },
    evening: {
      en: 'Evening',
      ko: '저녁',
      es: 'Noche',
      hi: 'शाम',
    },
    night: {
      en: 'Night',
      ko: '밤',
      es: 'Madrugada',
      hi: 'रात',
    },
    triggers: {
      en: 'Emotion triggers',
      ko: '감정 트리거',
      es: 'Desencadenantes',
      hi: 'भावनात्मक ट्रिगर',
    },
    noTriggers: {
      en: 'Log emotions with context tags to see triggers',
      ko: '감정 기록에 상황 태그를 추가하면 트리거가 보여요',
      es: 'Registra emociones con etiquetas para ver desencadenantes',
      hi: 'संदर्भ टैग के साथ भावनाएँ दर्ज करें',
    },
    moodCalendar: {
      en: 'Mood calendar',
      ko: '기분 달력',
      es: 'Calendario de ánimo',
      hi: 'मूड कैलेंडर',
    },
    weeklyReview: {
      en: 'Weekly review',
      ko: '주간 회고',
      es: 'Revisión semanal',
      hi: 'साप्ताहिक समीक्षा',
    },
    weeklyReviewPrompt: {
      en: 'It\'s Sunday — time to reflect on your week',
      ko: '일요일이에요 — 이번 주를 되돌아볼 시간이에요',
      es: 'Es domingo — hora de reflexionar sobre tu semana',
      hi: 'रविवार है — इस सप्ताह पर विचार करने का समय',
    },
    weeklyReviewBtn: {
      en: 'Start review',
      ko: '회고 시작',
      es: 'Comenzar revisión',
      hi: 'समीक्षा शुरू करें',
    },
    exportTitle: {
      en: 'Export your data',
      ko: '데이터 내보내기',
      es: 'Exportar datos',
      hi: 'डेटा निर्यात',
    },
    exportBtn: {
      en: 'Export as JSON',
      ko: 'JSON으로 내보내기',
      es: 'Exportar como JSON',
      hi: 'JSON के रूप में निर्यात',
    },
    exportSuccess: {
      en: 'Report saved!',
      ko: '저장됨!',
      es: '¡Guardado!',
      hi: 'सहेजा गया!',
    },
    empty: {
      title: {
        en: 'Your insights will build here',
        ko: '인사이트가 여기 만들어집니다',
        es: 'Tus insights se construirán aquí',
        hi: 'यहाँ आपकी अंतर्दृष्टि बनेगी',
      },
      body: {
        en: 'Log a few emotions and journal entries to see patterns emerge.',
        ko: '감정과 일기를 몇 개 기록하면 패턴이 보여요.',
        es: 'Registra algunas emociones y entradas para ver patrones.',
        hi: 'भावनाएँ और प्रविष्टियाँ दर्ज करें।',
      },
    },
    last7: {
      en: 'Last 7 days',
      ko: '최근 7일',
      es: 'Últimos 7 días',
      hi: 'पिछले 7 दिन',
    },
    chartLegend: {
      en: 'Each dot shows your average mood that day',
      ko: '각 점은 그날의 평균 기분',
      es: 'Cada punto muestra tu ánimo promedio ese día',
      hi: 'प्रत्येक बिंदु उस दिन का औसत मूड',
    },
    moodBreakdown: {
      en: 'Mood breakdown',
      ko: '기분 분석',
      es: 'Distribución de ánimo',
      hi: 'मूड विश्लेषण',
    },
    streakMotiv: {
      week: {
        en: 'Amazing! A full week! 🌟',
        ko: '대단해요! 일주일! 🌟',
        es: '¡Increíble! ¡Una semana! 🌟',
        hi: 'अद्भुत! पूरा सप्ताह! 🌟',
      },
      days: {
        en: 'days in a row!',
        ko: '일 연속!',
        es: 'días seguidos',
        hi: 'दिन लगातार!',
      },
      sub: {
        en: 'You\'re building a real self-care habit.',
        ko: '진정한 자기 관리 습관이에요.',
        es: 'Estás creando un hábito de autocuidado.',
        hi: 'आप आत्म-देखभाल की आदत बना रहे हैं।',
      },
    },
    insights: {
      title: {
        en: 'Insights',
        ko: '인사이트',
        es: 'Perspectivas',
        hi: 'अंतर्दृष्टि',
      },
      topMood: {
        en: 'Most logged mood',
        ko: '가장 많이 기록한 기분',
        es: 'Ánimo más registrado',
        hi: 'सबसे अधिक दर्ज किया गया मूड',
      },
      trend: {
        label: {
          en: 'Mood trend',
          ko: '기분 추세',
          es: 'Tendencia',
          hi: 'मूड प्रवृत्ति',
        },
        up: {
          en: '↑ Improving vs last week',
          ko: '↑ 지난 주보다 나아지고 있어요',
          es: '↑ Mejorando vs semana anterior',
          hi: '↑ पिछले सप्ताह से बेहतर',
        },
        down: {
          en: '↓ Declining vs last week',
          ko: '↓ 지난 주보다 낮아졌어요',
          es: '↓ Bajando vs semana anterior',
          hi: '↓ पिछले सप्ताह से कम',
        },
        flat: {
          en: '→ Stable vs last week',
          ko: '→ 지난 주와 비슷해요',
          es: '→ Estable vs semana anterior',
          hi: '→ पिछले सप्ताह जैसा',
        },
        none: {
          en: 'Log more entries to see your trend',
          ko: '추세를 보려면 더 기록해보세요',
          es: 'Registra más para ver tendencias',
          hi: 'अधिक प्रविष्टियाँ करें',
        },
      },
      bestDay: {
        en: 'Best day of your week',
        ko: '기분이 가장 좋은 요일',
        es: 'Tu mejor día',
        hi: 'सबसे अच्छा दिन',
      },
      noPattern: {
        en: 'Keep logging to discover patterns',
        ko: '매일 기록하면 패턴이 보여요',
        es: 'Sigue registrando para descubrir patrones',
        hi: 'पैटर्न देखने के लिए रोज़ लिखें',
      },
    },
  },
  backupScreen: {
    title: {
      en: 'Backup & Restore',
      ko: '백업 및 복원',
      es: 'Copia de seguridad y restauración',
      hi: 'बैकअप और पुनर्स्थापना',
    },
    back: {
      en: 'Back',
      ko: '뒤로',
      es: 'Atrás',
      hi: 'वापस',
    },
    subtitle: {
      en: 'Create an encrypted backup of everything stored on this device.',
      ko: '이 기기에 저장된 모든 데이터를 암호화하여 백업합니다.',
      es: 'Crea una copia de seguridad cifrada de todo lo guardado en este dispositivo.',
      hi: 'इस डिवाइस पर संग्रहीत सभी डेटा का एन्क्रिप्टेड बैकअप बनाएं।',
    },
    warningTitle: {
      en: '⚠️ You will not be able to recover this backup without your passphrase',
      ko: '⚠️ 암호를 잊으면 이 백업을 복구할 수 없습니다',
      es: '⚠️ No podrás recuperar esta copia de seguridad sin tu contraseña',
      hi: '⚠️ पासफ़्रेज़ के बिना इस बैकअप को पुनर्प्राप्त नहीं किया जा सकेगा',
    },
    warningBody: {
      en: "There is no way to reset a forgotten passphrase. If you lose it, this backup's data is gone for good.",
      ko: '잊어버린 암호는 재설정할 방법이 없습니다. 암호를 잃어버리면 이 백업의 데이터는 영구적으로 복구할 수 없습니다.',
      es: 'No hay forma de restablecer una contraseña olvidada. Si la pierdes, los datos de esta copia se perderán para siempre.',
      hi: 'भूली हुई पासफ़्रेज़ को रीसेट करने का कोई तरीका नहीं है। यदि आप इसे खो देते हैं, तो इस बैकअप का डेटा हमेशा के लिए चला जाएगा।',
    },
    passphraseLabel: {
      en: 'Passphrase',
      ko: '암호',
      es: 'Contraseña',
      hi: 'पासफ़्रेज़',
    },
    passphrasePlaceholder: {
      en: 'Enter a passphrase',
      ko: '암호를 입력하세요',
      es: 'Ingresa una contraseña',
      hi: 'एक पासफ़्रेज़ दर्ज करें',
    },
    confirmPassphraseLabel: {
      en: 'Confirm passphrase',
      ko: '암호 확인',
      es: 'Confirmar contraseña',
      hi: 'पासफ़्रेज़ की पुष्टि करें',
    },
    confirmPassphrasePlaceholder: {
      en: 'Enter it again',
      ko: '다시 입력하세요',
      es: 'Ingrésala de nuevo',
      hi: 'इसे फिर से दर्ज करें',
    },
    mismatchError: {
      en: "Passphrases don't match.",
      ko: '암호가 일치하지 않습니다.',
      es: 'Las contraseñas no coinciden.',
      hi: 'पासफ़्रेज़ मेल नहीं खाते।',
    },
    createButton: {
      en: 'Create backup',
      ko: '백업 만들기',
      es: 'Crear copia de seguridad',
      hi: 'बैकअप बनाएं',
    },
    creating: {
      en: 'Encrypting your data…',
      ko: '데이터를 암호화하는 중…',
      es: 'Cifrando tus datos…',
      hi: 'आपका डेटा एन्क्रिप्ट किया जा रहा है…',
    },
    backupDone: {
      title: {
        en: 'Backup created',
        ko: '백업 완료',
        es: 'Copia de seguridad creada',
        hi: 'बैकअप बनाया गया',
      },
      body: {
        en: 'Your encrypted backup is ready to save or share.',
        ko: '암호화된 백업을 저장하거나 공유할 수 있습니다.',
        es: 'Tu copia de seguridad cifrada está lista para guardar o compartir.',
        hi: 'आपका एन्क्रिप्टेड बैकअप सहेजने या साझा करने के लिए तैयार है।',
      },
    },
    backupFailed: {
      title: {
        en: 'Backup failed',
        ko: '백업 실패',
        es: 'Error al crear la copia de seguridad',
        hi: 'बैकअप विफल',
      },
      fallbackBody: {
        en: 'Something went wrong.',
        ko: '문제가 발생했습니다.',
        es: 'Algo salió mal.',
        hi: 'कुछ गड़बड़ हो गई।',
      },
    },
  },
  settingsScreen: {
    title: {
      en: 'Settings',
      ko: '설정',
      es: 'Ajustes',
      hi: 'सेटिंग',
    },
    notifications: {
      en: 'Daily reminder',
      ko: '매일 알림',
      es: 'Recordatorio diario',
      hi: 'दैनिक अनुस्मारक',
    },
    notificationsOff: {
      en: 'Off',
      ko: '끄기',
      es: 'Apagado',
      hi: 'बंद',
    },
    notificationsOn: {
      en: 'On',
      ko: '켜기',
      es: 'Encendido',
      hi: 'चालू',
    },
    reminderTime: {
      en: 'Reminder time',
      ko: '알림 시간',
      es: 'Hora del recordatorio',
      hi: 'अनुस्मारक समय',
    },
    reminderDays: {
      en: 'Days',
      ko: '요일',
      es: 'Días',
      hi: 'दिन',
    },
    appearance: {
      en: 'Appearance',
      ko: '외관',
      es: 'Apariencia',
      hi: 'रूप-रंग',
    },
    themeSystem: {
      en: 'System',
      ko: '시스템',
      es: 'Sistema',
      hi: 'सिस्टम',
    },
    themeLight: {
      en: 'Light',
      ko: '밝은',
      es: 'Claro',
      hi: 'हल्का',
    },
    themeDark: {
      en: 'Dark',
      ko: '어두운',
      es: 'Oscuro',
      hi: 'गहरा',
    },
    language: {
      en: 'Language',
      ko: '언어',
      es: 'Idioma',
      hi: 'भाषा',
    },
    data: {
      en: 'Your data',
      ko: '내 데이터',
      es: 'Tus datos',
      hi: 'आपका डेटा',
    },
    backupRestore: {
      en: 'Backup & Restore',
      ko: '백업 및 복원',
      es: 'Copia de seguridad y restauración',
      hi: 'बैकअप और पुनर्स्थापना',
    },
    shareClarityAI: {
      en: 'Share data with ClarityAI',
      ko: 'ClarityAI와 데이터 공유',
      es: 'Compartir datos con ClarityAI',
      hi: 'ClarityAI के साथ डेटा साझा करें',
    },
    deleteData: {
      en: 'Delete all data',
      ko: '전체 데이터 삭제',
      es: 'Eliminar todos los datos',
      hi: 'सारा डेटा हटाएँ',
    },
    deleteConfirm: {
      title: {
        en: 'Delete all data?',
        ko: '전체 데이터를 삭제할까요?',
        es: '¿Eliminar todos los datos?',
        hi: 'सारा डेटा हटाएँ?',
      },
      body: {
        en: 'This will permanently erase all journal entries, emotion logs, and settings. This cannot be undone.',
        ko: '모든 일기, 감정 기록, 설정이 영구적으로 삭제됩니다. 취소할 수 없어요.',
        es: 'Esto borrará permanentemente todas las entradas, emociones y ajustes.',
        hi: 'सभी डायरी, भावनाएँ और सेटिंग स्थायी रूप से हट जाएंगी।',
      },
      confirm: {
        en: 'Delete everything',
        ko: '모두 삭제',
        es: 'Eliminar todo',
        hi: 'सब हटाएँ',
      },
      cancel: {
        en: 'Cancel',
        ko: '취소',
        es: 'Cancelar',
        hi: 'रद्द करें',
      },
    },
    timePicker: {
      title: {
        en: 'Reminder time',
        ko: '알림 시간',
        es: 'Hora del recordatorio',
        hi: 'अनुस्मारक समय',
      },
      hourLabel: {
        en: 'Hour',
        ko: '시',
        es: 'Hora',
        hi: 'घंटा',
      },
      minuteLabel: {
        en: 'Min',
        ko: '분',
        es: 'Min',
        hi: 'मिनट',
      },
      am: {
        en: 'AM',
        ko: '오전',
        es: 'a.m.',
        hi: 'पूर्वाह्न',
      },
      pm: {
        en: 'PM',
        ko: '오후',
        es: 'p.m.',
        hi: 'अपराह्न',
      },
      confirm: {
        en: 'Set reminder',
        ko: '알림 설정',
        es: 'Guardar recordatorio',
        hi: 'अनुस्मारक सेट करें',
      },
      cancel: {
        en: 'Cancel',
        ko: '취소',
        es: 'Cancelar',
        hi: 'रद्द करें',
      },
    },
    notifPermission: {
      title: {
        en: 'Permission required',
        ko: '알림 권한이 필요해요',
        es: 'Se requiere permiso',
        hi: 'अनुमति आवश्यक है',
      },
      body: {
        en: 'Please enable notifications in your device settings to receive daily reminders.',
        ko: '매일 알림을 받으려면 기기 설정에서 알림을 켜주세요.',
        es: 'Activa las notificaciones en la configuración de tu dispositivo para recibir recordatorios diarios.',
        hi: 'दैनिक अनुस्मारक पाने के लिए कृपया अपनी डिवाइस सेटिंग में सूचनाएं चालू करें।',
      },
    },
    dataDeleted: {
      title: {
        en: 'Done',
        ko: '완료',
        es: 'Listo',
        hi: 'हो गया',
      },
      body: {
        en: 'All data has been deleted.',
        ko: '모든 데이터가 삭제되었습니다.',
        es: 'Todos los datos han sido eliminados.',
        hi: 'सारा डेटा हटा दिया गया है।',
      },
    },
    exportSaved: {
      title: {
        en: 'Exported',
        ko: '내보내기 완료',
        es: 'Exportado',
        hi: 'निर्यात हो गया',
      },
      bodyPrefix: {
        en: 'Saved to: ',
        ko: '저장 위치: ',
        es: 'Guardado en: ',
        hi: 'यहाँ सहेजा गया: ',
      },
    },
    exportFailed: {
      title: {
        en: 'Export failed',
        ko: '내보내기 실패',
        es: 'Error al exportar',
        hi: 'निर्यात विफल',
      },
      fallbackBody: {
        en: 'Something went wrong.',
        ko: '문제가 발생했습니다.',
        es: 'Algo salió mal.',
        hi: 'कुछ गड़बड़ हो गई।',
      },
    },
    privacy: {
      en: 'Privacy policy',
      ko: '개인정보 처리방침',
      es: 'Política de privacidad',
      hi: 'गोपनीयता नीति',
    },
    youtube: {
      en: 'Watch on YouTube',
      ko: 'YouTube에서 보기',
      es: 'Ver en YouTube',
      hi: 'YouTube पर देखें',
    },
    version: {
      en: 'Version',
      ko: '버전',
      es: 'Versión',
      hi: 'संस्करण',
    },
    daysShort: {
      en: [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
      ],
      ko: [
        '일',
        '월',
        '화',
        '수',
        '목',
        '금',
        '토',
      ],
      es: [
        'Do',
        'Lu',
        'Ma',
        'Mi',
        'Ju',
        'Vi',
        'Sá',
      ],
      hi: [
        'र',
        'सो',
        'मं',
        'बु',
        'गु',
        'शु',
        'श',
      ],
    },
    about: {
      en: 'About',
      ko: '앱 정보',
      es: 'Acerca de',
      hi: 'ऐप के बारे में',
    },
    aboutBody: {
      en: 'Clarity in Calm is a private, offline-first wellness journal. All data is encrypted on your device and never leaves it.',
      ko: 'Clarity in Calm은 오프라인 우선 웰니스 앱입니다. 모든 데이터는 기기에 암호화되어 저장됩니다.',
      es: 'Clarity in Calm es una app de bienestar privada y sin conexión. Todos los datos se cifran en tu dispositivo.',
      hi: 'Clarity in Calm एक निजी ऑफलाइन वेलनेस ऐप है।',
    },
    account: {
      header: {
        en: 'Account',
        ko: '계정',
        es: 'Cuenta',
        hi: 'खाता',
      },
      subtitle: {
        en: 'Sign in to sync and back up your data.',
        ko: '로그인하면 데이터를 동기화하고 백업할 수 있어요.',
        es: 'Inicia sesión para sincronizar y respaldar tus datos.',
        hi: 'सिंक और बैकअप के लिए साइन इन करें।',
      },
      deviceLocal: {
        en: 'Device-local. No account needed — everything stays encrypted on this device.',
        ko: '기기 저장. 계정이 필요 없어요 — 모든 데이터는 이 기기에 암호화되어 저장됩니다.',
        es: 'Local en tu dispositivo. No necesitas una cuenta — todo permanece cifrado en este dispositivo.',
        hi: 'डिवाइस-स्थानीय। खाते की ज़रूरत नहीं — सब कुछ इस डिवाइस पर एन्क्रिप्टेड रहता है।',
      },
      signIn: {
        en: 'Sign in / Create account',
        ko: '로그인 / 계정 만들기',
        es: 'Iniciar sesión / Crear cuenta',
        hi: 'साइन इन करें / खाता बनाएँ',
      },
      signOut: {
        en: 'Sign out',
        ko: '로그아웃',
        es: 'Cerrar sesión',
        hi: 'साइन आउट',
      },
      deleteAccount: {
        en: 'Delete account',
        ko: '계정 삭제',
        es: 'Eliminar cuenta',
        hi: 'खाता हटाएँ',
      },
      deleteConfirm: {
        title: {
          en: 'Delete account?',
          ko: '계정을 삭제할까요?',
          es: '¿Eliminar cuenta?',
          hi: 'खाता हटाएँ?',
        },
        body: {
          en: 'This permanently deletes your account and cannot be undone.',
          ko: '계정이 영구적으로 삭제되며 취소할 수 없습니다.',
          es: 'Esto elimina permanentemente tu cuenta y no se puede deshacer.',
          hi: 'इससे आपका खाता स्थायी रूप से हट जाएगा और इसे पूर्ववत नहीं किया जा सकता।',
        },
        confirm: {
          en: 'Delete',
          ko: '삭제',
          es: 'Eliminar',
          hi: 'हटाएँ',
        },
        cancel: {
          en: 'Cancel',
          ko: '취소',
          es: 'Cancelar',
          hi: 'रद्द करें',
        },
      },
      deleteError: {
        title: {
          en: 'Could not delete account',
          ko: '계정을 삭제할 수 없습니다',
          es: 'No se pudo eliminar la cuenta',
          hi: 'खाता नहीं हटाया जा सका',
        },
        body: {
          en: 'Please try again.',
          ko: '다시 시도해 주세요.',
          es: 'Inténtalo de nuevo.',
          hi: 'कृपया फिर से प्रयास करें।',
        },
      },
    },
  },
  authScreen: {
    signIn: {
      title: {
        en: 'Welcome back',
        ko: '다시 오신 것을 환영해요',
        es: 'Bienvenido de nuevo',
        hi: 'वापसी पर स्वागत है',
      },
      subtitle: {
        en: 'Sign in to Clarity in Calm.',
        ko: 'Clarity in Calm에 로그인하세요.',
        es: 'Inicia sesión en Clarity in Calm.',
        hi: 'Clarity in Calm में साइन इन करें।',
      },
      emailLabel: {
        en: 'Email',
        ko: '이메일',
        es: 'Correo electrónico',
        hi: 'ईमेल',
      },
      emailPlaceholder: {
        en: 'email@example.com',
        ko: 'email@example.com',
        es: 'email@example.com',
        hi: 'email@example.com',
      },
      passwordLabel: {
        en: 'Password',
        ko: '비밀번호',
        es: 'Contraseña',
        hi: 'पासवर्ड',
      },
      passwordPlaceholder: {
        en: '••••••••',
        ko: '••••••••',
        es: '••••••••',
        hi: '••••••••',
      },
      forgotPassword: {
        en: 'Forgot password?',
        ko: '비밀번호를 잊으셨나요?',
        es: '¿Olvidaste tu contraseña?',
        hi: 'पासवर्ड भूल गए?',
      },
      submit: {
        en: 'Sign In',
        ko: '로그인',
        es: 'Iniciar sesión',
        hi: 'साइन इन करें',
      },
      or: {
        en: 'or',
        ko: '또는',
        es: 'o',
        hi: 'या',
      },
      continueWithGoogle: {
        en: 'Continue with Google',
        ko: 'Google로 계속하기',
        es: 'Continuar con Google',
        hi: 'Google से जारी रखें',
      },
      noAccountPrefix: {
        en: 'Don\'t have an account? ',
        ko: '계정이 없으신가요? ',
        es: '¿No tienes una cuenta? ',
        hi: 'खाता नहीं है? ',
      },
      signUpLink: {
        en: 'Sign up',
        ko: '회원가입',
        es: 'Regístrate',
        hi: 'साइन अप करें',
      },
      errors: {
        missingCredentials: {
          en: 'Enter your email and password',
          ko: '이메일과 비밀번호를 입력하세요',
          es: 'Ingresa tu correo y contraseña',
          hi: 'अपना ईमेल और पासवर्ड डालें',
        },
        generic: {
          en: 'Could not sign in. Please try again.',
          ko: '로그인할 수 없습니다. 다시 시도해 주세요.',
          es: 'No se pudo iniciar sesión. Inténtalo de nuevo.',
          hi: 'साइन इन नहीं हो सका। कृपया फिर से प्रयास करें।',
        },
        google: {
          en: 'Could not sign in with Google. Please try again.',
          ko: 'Google 로그인에 실패했습니다. 다시 시도해 주세요.',
          es: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
          hi: 'Google से साइन इन नहीं हो सका। कृपया फिर से प्रयास करें।',
        },
      },
    },
    signUp: {
      title: {
        en: 'Create your account',
        ko: '계정 만들기',
        es: 'Crea tu cuenta',
        hi: 'अपना खाता बनाएँ',
      },
      subtitle: {
        en: 'Sign up to start using Clarity in Calm.',
        ko: 'Clarity in Calm을 시작하려면 가입하세요.',
        es: 'Regístrate para empezar a usar Clarity in Calm.',
        hi: 'Clarity in Calm का उपयोग शुरू करने के लिए साइन अप करें।',
      },
      emailLabel: {
        en: 'Email',
        ko: '이메일',
        es: 'Correo electrónico',
        hi: 'ईमेल',
      },
      emailPlaceholder: {
        en: 'email@example.com',
        ko: 'email@example.com',
        es: 'email@example.com',
        hi: 'email@example.com',
      },
      passwordLabel: {
        en: 'Password',
        ko: '비밀번호',
        es: 'Contraseña',
        hi: 'पासवर्ड',
      },
      passwordPlaceholder: {
        en: 'At least 8 characters',
        ko: '8자 이상 입력하세요',
        es: 'Al menos 8 caracteres',
        hi: 'कम से कम 8 अक्षर',
      },
      consentPrefix: {
        en: 'I agree to the ',
        ko: '',
        es: 'Acepto la ',
        hi: '',
      },
      consentLink: {
        en: 'Privacy Policy',
        ko: '개인정보 처리방침에 동의합니다',
        es: 'Política de Privacidad',
        hi: 'मैं गोपनीयता नीति से सहमत हूँ',
      },
      submit: {
        en: 'Sign Up',
        ko: '회원가입',
        es: 'Registrarme',
        hi: 'साइन अप करें',
      },
      hasAccountPrefix: {
        en: 'Already have an account? ',
        ko: '이미 계정이 있으신가요? ',
        es: '¿Ya tienes una cuenta? ',
        hi: 'पहले से खाता है? ',
      },
      signInLink: {
        en: 'Sign in',
        ko: '로그인',
        es: 'Inicia sesión',
        hi: 'साइन इन करें',
      },
      confirmEmailNotice: {
        en: 'Check your email to confirm your account',
        ko: '계정을 확인하려면 이메일을 확인하세요',
        es: 'Revisa tu correo para confirmar tu cuenta',
        hi: 'अपना खाता पुष्ट करने के लिए ईमेल जाँचें',
      },
      errors: {
        missing: {
          en: 'Enter an email and password',
          ko: '이메일과 비밀번호를 입력하세요',
          es: 'Ingresa un correo y una contraseña',
          hi: 'एक ईमेल और पासवर्ड डालें',
        },
        passwordTooShort: {
          en: 'Password must be at least 8 characters',
          ko: '비밀번호는 8자 이상이어야 합니다',
          es: 'La contraseña debe tener al menos 8 caracteres',
          hi: 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए',
        },
        consentRequired: {
          en: 'Please agree to the Privacy Policy to continue',
          ko: '계속하려면 개인정보 처리방침에 동의해 주세요',
          es: 'Acepta la Política de Privacidad para continuar',
          hi: 'जारी रखने के लिए गोपनीयता नीति से सहमत हों',
        },
        generic: {
          en: 'Could not create account. Please try again.',
          ko: '계정을 만들 수 없습니다. 다시 시도해 주세요.',
          es: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
          hi: 'खाता नहीं बनाया जा सका। कृपया फिर से प्रयास करें।',
        },
      },
    },
    forgotPassword: {
      title: {
        en: 'Reset your password',
        ko: '비밀번호 재설정',
        es: 'Restablece tu contraseña',
        hi: 'अपना पासवर्ड रीसेट करें',
      },
      subtitle: {
        en: 'We\'ll email you a link to reset your password.',
        ko: '비밀번호를 재설정할 수 있는 링크를 이메일로 보내드릴게요.',
        es: 'Te enviaremos un enlace para restablecer tu contraseña.',
        hi: 'हम आपको पासवर्ड रीसेट करने के लिए एक लिंक ईमेल करेंगे।',
      },
      emailLabel: {
        en: 'Email',
        ko: '이메일',
        es: 'Correo electrónico',
        hi: 'ईमेल',
      },
      emailPlaceholder: {
        en: 'email@example.com',
        ko: 'email@example.com',
        es: 'email@example.com',
        hi: 'email@example.com',
      },
      submit: {
        en: 'Send Reset Link',
        ko: '재설정 링크 보내기',
        es: 'Enviar enlace',
        hi: 'रीसेट लिंक भेजें',
      },
      sentBodyPrefix: {
        en: 'If an account exists for ',
        ko: '만약 ',
        es: 'Si existe una cuenta para ',
        hi: 'अगर ',
      },
      sentBodySuffix: {
        en: ', we\'ve sent a link to reset your password.',
        ko: '에 대한 계정이 있다면, 비밀번호 재설정 링크를 보내드렸어요.',
        es: ', te hemos enviado un enlace para restablecer tu contraseña.',
        hi: ' के लिए कोई खाता मौजूद है, तो हमने पासवर्ड रीसेट करने के लिए एक लिंक भेज दिया है।',
      },
      backToSignIn: {
        en: 'Back to Sign In',
        ko: '로그인으로 돌아가기',
        es: 'Volver a iniciar sesión',
        hi: 'साइन इन पर वापस जाएँ',
      },
      cancel: {
        en: 'Cancel',
        ko: '취소',
        es: 'Cancelar',
        hi: 'रद्द करें',
      },
      errors: {
        missingEmail: {
          en: 'Enter your email',
          ko: '이메일을 입력하세요',
          es: 'Ingresa tu correo electrónico',
          hi: 'अपना ईमेल डालें',
        },
        generic: {
          en: 'Could not send reset email. Please try again.',
          ko: '재설정 이메일을 보낼 수 없습니다. 다시 시도해 주세요.',
          es: 'No se pudo enviar el correo de restablecimiento. Inténtalo de nuevo.',
          hi: 'रीसेट ईमेल नहीं भेजा जा सका। कृपया फिर से प्रयास करें।',
        },
      },
    },
    resetPassword: {
      title: {
        en: 'Set a new password',
        ko: '새 비밀번호 설정',
        es: 'Configura una nueva contraseña',
        hi: 'नया पासवर्ड सेट करें',
      },
      passwordLabel: {
        en: 'New Password',
        ko: '새 비밀번호',
        es: 'Nueva contraseña',
        hi: 'नया पासवर्ड',
      },
      passwordPlaceholder: {
        en: 'At least 8 characters',
        ko: '8자 이상 입력하세요',
        es: 'Al menos 8 caracteres',
        hi: 'कम से कम 8 अक्षर',
      },
      submit: {
        en: 'Update Password',
        ko: '비밀번호 변경',
        es: 'Actualizar contraseña',
        hi: 'पासवर्ड अपडेट करें',
      },
      errors: {
        expiredLink: {
          en: 'This reset link has expired. Request a new one.',
          ko: '재설정 링크가 만료되었습니다. 새 링크를 요청하세요.',
          es: 'Este enlace ha expirado. Solicita uno nuevo.',
          hi: 'यह रीसेट लिंक समाप्त हो गया है। नया लिंक माँगें।',
        },
        passwordTooShort: {
          en: 'Password must be at least 8 characters',
          ko: '비밀번호는 8자 이상이어야 합니다',
          es: 'La contraseña debe tener al menos 8 caracteres',
          hi: 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए',
        },
        generic: {
          en: 'Could not update password. Please try again.',
          ko: '비밀번호를 변경할 수 없습니다. 다시 시도해 주세요.',
          es: 'No se pudo actualizar la contraseña. Inténtalo de nuevo.',
          hi: 'पासवर्ड अपडेट नहीं हो सका। कृपया फिर से प्रयास करें।',
        },
      },
    },
    oauth: {
      googleGenericError: {
        en: 'Could not start Google sign-in',
        ko: 'Google 로그인을 시작할 수 없습니다',
        es: 'No se pudo iniciar el proceso de Google',
        hi: 'Google साइन-इन शुरू नहीं हो सका',
      },
      appleNoToken: {
        en: 'Apple sign-in did not return an identity token',
        ko: 'Apple 로그인에서 인증 토큰을 받지 못했습니다',
        es: 'El inicio de sesión con Apple no devolvió un token de identidad',
        hi: 'Apple साइन-इन से पहचान टोकन नहीं मिला',
      },
      appleGenericError: {
        en: 'Could not sign in with Apple. Please try again.',
        ko: 'Apple 로그인에 실패했습니다. 다시 시도해 주세요.',
        es: 'No se pudo iniciar sesión con Apple. Inténtalo de nuevo.',
        hi: 'Apple से साइन इन नहीं हो सका। कृपया फिर से प्रयास करें।',
      },
    },
  },
  journalExtended: {
    searchPlaceholder: {
      en: 'Search entries…',
      ko: '기록 검색…',
      es: 'Buscar entradas…',
      hi: 'प्रविष्टियाँ खोजें…',
    },
    templates: {
      en: 'Templates',
      ko: '템플릿',
      es: 'Plantillas',
      hi: 'टेम्पलेट',
    },
    tags: {
      en: 'Tags',
      ko: '태그',
      es: 'Etiquetas',
      hi: 'टैग',
    },
    addTag: {
      en: '+ Add tag',
      ko: '+ 태그 추가',
      es: '+ Agregar etiqueta',
      hi: '+ टैग जोड़ें',
    },
    calendar: {
      en: 'Calendar',
      ko: '달력',
      es: 'Calendario',
      hi: 'कैलेंडर',
    },
    futureSelf: {
      en: 'Future Self',
      ko: '미래의 나',
      es: 'Yo futuro',
      hi: 'भविष्य का मैं',
    },
    futureSelfTitle: {
      en: 'Write to your future self',
      ko: '미래의 나에게 쓰기',
      es: 'Escribir a tu yo futuro',
      hi: 'भविष्य के मुझे लिखें',
    },
    futureSelfSubtitle: {
      en: 'Choose a date to unlock this letter',
      ko: '이 편지를 열 날짜를 선택하세요',
      es: 'Elige una fecha para abrir esta carta',
      hi: 'इस पत्र को खोलने की तारीख चुनें',
    },
    futureSelfLocked: {
      en: 'Unlocks on',
      ko: '열리는 날짜',
      es: 'Se abre el',
      hi: 'खुलेगा',
    },
    futureSelfUnlock: {
      en: 'Open letter',
      ko: '편지 열기',
      es: 'Abrir carta',
      hi: 'पत्र खोलें',
    },
    unlockDate: {
      en: 'Unlock date',
      ko: '해제 날짜',
      es: 'Fecha de apertura',
      hi: 'खुलने की तारीख',
    },
    setDate: {
      en: 'Set date',
      ko: '날짜 설정',
      es: 'Establecer fecha',
      hi: 'तारीख सेट करें',
    },
    templateFreeWrite: {
      en: 'Free Write',
      ko: '자유 쓰기',
      es: 'Escritura libre',
      hi: 'स्वतंत्र लेखन',
    },
    templateGratitude: {
      en: 'Gratitude',
      ko: '감사',
      es: 'Gratitud',
      hi: 'कृतज्ञता',
    },
    templateReflection: {
      en: 'Daily Reflection',
      ko: '하루 회고',
      es: 'Reflexión diaria',
      hi: 'दैनिक समीक्षा',
    },
    templateCBT: {
      en: 'Thought Check',
      ko: '생각 점검',
      es: 'Revisión de pensamientos',
      hi: 'विचार जाँच',
    },
    templateWeeklyReview: {
      en: 'Weekly Review',
      ko: '주간 회고',
      es: 'Revisión semanal',
      hi: 'साप्ताहिक समीक्षा',
    },
    templateFutureSelf: {
      en: 'Future Self',
      ko: '미래의 나',
      es: 'Yo futuro',
      hi: 'भविष्य का मैं',
    },
    templatePrompts: {
      gratitude: {
        en: [
          '1. I am grateful for...',
          '2. Something small that made me smile...',
          '3. A person I appreciate and why...',
        ],
        ko: [
          '1. 감사한 것은...',
          '2. 오늘 나를 미소 짓게 한 작은 일...',
          '3. 내가 고맙게 여기는 사람과 그 이유...',
        ],
        es: [
          '1. Estoy agradecido/a por...',
          '2. Algo pequeño que me hizo sonreír...',
          '3. Una persona que aprecio y por qué...',
        ],
        hi: [
          '1. मैं इसके लिए आभारी हूँ...',
          '2. कोई छोटी सी बात जिसने मुझे मुस्कुराया...',
          '3. वह व्यक्ति जिसकी मैं सराहना करता/करती हूँ और क्यों...',
        ],
      },
      reflection: {
        en: [
          'What drained my energy today?',
          'What gave me energy today?',
          'What would I do differently tomorrow?',
        ],
        ko: [
          '오늘 나를 지치게 한 것은?',
          '오늘 나에게 힘을 준 것은?',
          '내일은 무엇을 다르게 해볼까?',
        ],
        es: [
          '¿Qué me agotó hoy?',
          '¿Qué me dio energía hoy?',
          '¿Qué haría diferente mañana?',
        ],
        hi: [
          'आज मुझे किस चीज़ ने थकाया?',
          'आज मुझे किस चीज़ ने ऊर्जा दी?',
          'कल मैं क्या अलग करूँगा/करूँगी?',
        ],
      },
      cbt: {
        en: [
          'The thought I keep having:',
          'Evidence that supports this thought:',
          'Evidence against this thought:',
          'A more balanced way to see this:',
        ],
        ko: [
          '계속 떠오르는 생각:',
          '이 생각을 뒷받침하는 근거:',
          '이 생각에 반대되는 근거:',
          '더 균형 잡힌 시각:',
        ],
        es: [
          'El pensamiento que sigo teniendo:',
          'Evidencia que respalda este pensamiento:',
          'Evidencia en contra de este pensamiento:',
          'Una forma más equilibrada de verlo:',
        ],
        hi: [
          'वह विचार जो बार-बार आता है:',
          'इस विचार का समर्थन करने वाले प्रमाण:',
          'इस विचार के खिलाफ प्रमाण:',
          'इसे देखने का एक अधिक संतुलित तरीका:',
        ],
      },
      'weekly-review': {
        en: [
          'What drained me this week?',
          'What energized me this week?',
          'A win I am proud of:',
          'One intention for next week:',
        ],
        ko: [
          '이번 주 나를 지치게 한 것은?',
          '이번 주 나에게 힘을 준 것은?',
          '자랑스러운 성취:',
          '다음 주를 위한 다짐 하나:',
        ],
        es: [
          '¿Qué me agotó esta semana?',
          '¿Qué me dio energía esta semana?',
          'Un logro del que estoy orgulloso/a:',
          'Una intención para la próxima semana:',
        ],
        hi: [
          'इस हफ्ते मुझे किस चीज़ ने थकाया?',
          'इस हफ्ते मुझे किस चीज़ ने ऊर्जा दी?',
          'एक उपलब्धि जिस पर मुझे गर्व है:',
          'अगले हफ्ते के लिए एक इरादा:',
        ],
      },
      'future-self': {
        en: [
          'Dear future me,',
          'Right now I am feeling...',
          'Something I hope you remember:',
          'A message of encouragement:',
        ],
        ko: [
          '미래의 나에게,',
          '지금 나는 이런 기분이야...',
          '꼭 기억했으면 하는 것:',
          '응원의 한마디:',
        ],
        es: [
          'Querido yo futuro,',
          'Ahora mismo me siento...',
          'Algo que espero que recuerdes:',
          'Un mensaje de aliento:',
        ],
        hi: [
          'प्रिय भविष्य के मुझे,',
          'अभी मैं महसूस कर रहा/रही हूँ...',
          'कुछ जो मैं चाहता/चाहती हूँ तुम याद रखो:',
          'एक प्रोत्साहन भरा संदेश:',
        ],
      },
    },
    noResults: {
      en: 'No entries match your search',
      ko: '검색 결과가 없어요',
      es: 'Sin resultados para tu búsqueda',
      hi: 'कोई परिणाम नहीं',
    },
    customTagPlaceholder: {
      en: 'custom tag…',
      ko: '태그 입력…',
      es: 'etiqueta…',
      hi: 'टैग…',
    },
    addTagConfirm: {
      en: 'Add',
      ko: '추가',
      es: 'Agregar',
      hi: 'जोड़ें',
    },
    deleteEntry: {
      en: 'Delete',
      ko: '삭제',
      es: 'Eliminar',
      hi: 'हटाएँ',
    },
    tagLabels: {
      work: {
        en: 'work',
        ko: '업무',
        es: 'trabajo',
        hi: 'काम',
      },
      home: {
        en: 'home',
        ko: '집',
        es: 'hogar',
        hi: 'घर',
      },
      family: {
        en: 'family',
        ko: '가족',
        es: 'familia',
        hi: 'परिवार',
      },
      health: {
        en: 'health',
        ko: '건강',
        es: 'salud',
        hi: 'स्वास्थ्य',
      },
      relationship: {
        en: 'relationship',
        ko: '관계',
        es: 'relación',
        hi: 'रिश्ता',
      },
      growth: {
        en: 'growth',
        ko: '성장',
        es: 'crecimiento',
        hi: 'विकास',
      },
      gratitude: {
        en: 'gratitude',
        ko: '감사',
        es: 'gratitud',
        hi: 'आभार',
      },
      stress: {
        en: 'stress',
        ko: '스트레스',
        es: 'estrés',
        hi: 'तनाव',
      },
      joy: {
        en: 'joy',
        ko: '기쁨',
        es: 'alegría',
        hi: 'खुशी',
      },
      sleep: {
        en: 'sleep',
        ko: '수면',
        es: 'sueño',
        hi: 'नींद',
      },
    },
  },
  dailyContent: {
    // Daily reminder push notification. One body per day of the week, so the
    // reminder doesn't read as the same sentence every morning. Kept
    // day-agnostic (no "new week" phrasing) so the rotation order carries no
    // meaning and can shift without the copy going wrong.
    reminderTitle: {
      en: 'A moment for you',
      ko: '당신을 위한 시간',
      es: 'Un momento para ti',
      hi: 'आपके लिए एक पल',
    },
    reminderBodies: {
      en: [
        'How are you arriving today? Take a moment to notice.',
        'A breath, and a check-in. What are you feeling?',
        'Your mind deserves a quiet minute. Ready?',
        'What\'s present for you right now?',
        'Pause for a moment — name what you\'re carrying.',
        'Checking in. No pressure, just honesty.',
        'A small moment of clarity is waiting.',
      ],
      ko: [
        '오늘 어떤 마음으로 계신가요? 잠시 살펴보세요.',
        '숨 한 번, 그리고 체크인. 지금 어떤 기분인가요?',
        '마음에게 조용한 1분을 선물해 보세요.',
        '지금 당신에게 떠오르는 감정은 무엇인가요?',
        '잠시 멈추고, 품고 있는 감정에 이름을 붙여보세요.',
        '체크인할 시간이에요. 부담 없이, 솔직하게.',
        '작은 명료함의 순간이 기다리고 있어요.',
      ],
      es: [
        '¿Cómo llegas hoy? Tómate un momento para notarlo.',
        'Una respiración y un momento contigo. ¿Qué sientes?',
        'Tu mente merece un minuto de calma. ¿Empezamos?',
        '¿Qué está presente para ti ahora mismo?',
        'Haz una pausa — ponle nombre a lo que llevas dentro.',
        'Un momento para ti. Sin presión, solo honestidad.',
        'Te espera un pequeño momento de claridad.',
      ],
      hi: [
        'आज आप कैसा महसूस कर रहे हैं? एक पल रुककर देखिए।',
        'एक साँस, और एक ठहराव। अभी क्या महसूस हो रहा है?',
        'आपके मन को एक शांत मिनट चाहिए। तैयार हैं?',
        'इस पल आपके भीतर क्या चल रहा है?',
        'थोड़ा रुकिए — जो भाव साथ लिए हैं, उसे नाम दीजिए।',
        'बस एक ठहराव। कोई दबाव नहीं, बस सच्चाई।',
        'स्पष्टता का एक छोटा पल आपका इंतज़ार कर रहा है।',
      ],
    },
    quotes: {
      en: [
        {
          text: 'Take a breath. It\'s just a bad day, not a bad life.',
          author: 'Unknown',
        },
        {
          text: 'You don\'t have to control your thoughts. You just have to stop letting them control you.',
          author: 'Dan Millman',
        },
        {
          text: 'Almost everything will work again if you unplug it for a few minutes — including you.',
          author: 'Anne Lamott',
        },
        {
          text: 'Peace comes from within. Do not seek it without.',
          author: 'Buddha',
        },
        {
          text: 'You are enough. You have always been enough.',
          author: 'Unknown',
        },
        {
          text: 'Within you, there is a stillness and a sanctuary to which you can retreat at any time.',
          author: 'Hermann Hesse',
        },
        {
          text: 'The present moment is the only time over which we have dominion.',
          author: 'Thich Nhat Hanh',
        },
        {
          text: 'Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.',
          author: 'Oprah Winfrey',
        },
        {
          text: 'Self-care is not self-indulgence. It is self-preservation.',
          author: 'Audre Lorde',
        },
        {
          text: 'In the middle of difficulty lies opportunity.',
          author: 'Albert Einstein',
        },
        {
          text: 'Happiness is not something ready-made. It comes from your own actions.',
          author: 'Dalai Lama',
        },
        {
          text: 'Caring for yourself is not selfish — it\'s essential.',
          author: 'Unknown',
        },
        {
          text: 'You don\'t have to be positive all the time. It\'s perfectly okay to feel sad, angry, annoyed, or anxious.',
          author: 'Lori Deschene',
        },
        {
          text: 'Start where you are. Use what you have. Do what you can.',
          author: 'Arthur Ashe',
        },
        {
          text: 'Even the darkest night will end and the sun will rise.',
          author: 'Victor Hugo',
        },
      ],
      ko: [
        {
          text: '숨을 쉬어보세요. 그저 힘든 하루일 뿐, 힘든 인생이 아니에요.',
          author: '작자 미상',
        },
        {
          text: '생각을 통제할 필요는 없어요. 그저 생각이 나를 지배하지 못하게 하면 됩니다.',
          author: '댄 밀먼',
        },
        {
          text: '거의 모든 것은 몇 분만 전원을 꺼두면 다시 제대로 작동해요 — 당신도 마찬가지예요.',
          author: '앤 라모트',
        },
        {
          text: '평화는 내면에서 옵니다. 밖에서 찾으려 하지 마세요.',
          author: '붓다',
        },
        {
          text: '당신은 이미 충분해요. 언제나 그래왔어요.',
          author: '작자 미상',
        },
        {
          text: '당신 안에는 언제든 물러나 쉴 수 있는 고요함과 안식처가 있습니다.',
          author: '헤르만 헤세',
        },
        {
          text: '지금 이 순간이야말로 우리가 다스릴 수 있는 유일한 시간입니다.',
          author: '틱낫한',
        },
        {
          text: '숨을 쉬세요. 내려놓으세요. 그리고 지금 이 순간이야말로 당신이 확실히 가진 유일한 순간임을 기억하세요.',
          author: '오프라 윈프리',
        },
        {
          text: '자기 돌봄은 자기 방종이 아닙니다. 그것은 자기 보존입니다.',
          author: '오드리 로드',
        },
        {
          text: '어려움의 한가운데에 기회가 있습니다.',
          author: '알베르트 아인슈타인',
        },
        {
          text: '행복은 이미 만들어져 있는 것이 아닙니다. 그것은 당신 자신의 행동에서 옵니다.',
          author: '달라이 라마',
        },
        {
          text: '자신을 돌보는 것은 이기적인 것이 아니라 꼭 필요한 일이에요.',
          author: '작자 미상',
        },
        {
          text: '항상 긍정적일 필요는 없어요. 슬프거나 화나거나 짜증 나거나 불안해도 전혀 괜찮습니다.',
          author: '로리 디셴',
        },
        {
          text: '지금 있는 곳에서 시작하세요. 가진 것을 활용하세요. 할 수 있는 것을 하세요.',
          author: '아서 애시',
        },
        {
          text: '아무리 어두운 밤도 끝나고, 해는 다시 떠오릅니다.',
          author: '빅토르 위고',
        },
      ],
      es: [
        {
          text: 'Respira. Es solo un mal día, no una mala vida.',
          author: 'Anónimo',
        },
        {
          text: 'No tienes que controlar tus pensamientos. Solo tienes que dejar de permitir que ellos te controlen a ti.',
          author: 'Dan Millman',
        },
        {
          text: 'Casi todo vuelve a funcionar si lo desconectas unos minutos, incluida tú misma.',
          author: 'Anne Lamott',
        },
        {
          text: 'La paz viene de adentro. No la busques afuera.',
          author: 'Buda',
        },
        {
          text: 'Eres suficiente. Siempre lo has sido.',
          author: 'Anónimo',
        },
        {
          text: 'Dentro de ti hay una quietud y un santuario al que puedes retirarte en cualquier momento.',
          author: 'Hermann Hesse',
        },
        {
          text: 'El momento presente es el único tiempo sobre el que tenemos dominio.',
          author: 'Thich Nhat Hanh',
        },
        {
          text: 'Respira. Suelta. Y recuérdate que este mismo instante es el único que sabes con certeza que tienes.',
          author: 'Oprah Winfrey',
        },
        {
          text: 'El autocuidado no es autocomplacencia. Es autopreservación.',
          author: 'Audre Lorde',
        },
        {
          text: 'En medio de la dificultad reside la oportunidad.',
          author: 'Albert Einstein',
        },
        {
          text: 'La felicidad no es algo ya hecho. Proviene de tus propias acciones.',
          author: 'Dalái Lama',
        },
        {
          text: 'Cuidarte a ti misma no es egoísmo, es esencial.',
          author: 'Anónimo',
        },
        {
          text: 'No tienes que ser positiva todo el tiempo. Está perfectamente bien sentirte triste, enojada, molesta o ansiosa.',
          author: 'Lori Deschene',
        },
        {
          text: 'Empieza donde estás. Usa lo que tienes. Haz lo que puedas.',
          author: 'Arthur Ashe',
        },
        {
          text: 'Incluso la noche más oscura terminará y el sol saldrá.',
          author: 'Víctor Hugo',
        },
      ],
      hi: [
        {
          text: 'एक सांस लें। यह बस एक बुरा दिन है, बुरी ज़िंदगी नहीं।',
          author: 'अज्ञात',
        },
        {
          text: 'आपको अपने विचारों को नियंत्रित करने की ज़रूरत नहीं है। बस उन्हें आप पर हावी होने से रोकना है।',
          author: 'डैन मिलमैन',
        },
        {
          text: 'लगभग हर चीज़ कुछ मिनट के लिए बंद करने पर फिर से ठीक काम करने लगती है — आप भी।',
          author: 'ऐन लैमॉट',
        },
        {
          text: 'शांति भीतर से आती है। इसे बाहर मत खोजो।',
          author: 'बुद्ध',
        },
        {
          text: 'आप काफी हैं। आप हमेशा से काफी रहे हैं।',
          author: 'अज्ञात',
        },
        {
          text: 'आपके भीतर एक शांति और एक शरण-स्थल है, जहाँ आप कभी भी लौट सकते हैं।',
          author: 'हरमन हेसे',
        },
        {
          text: 'वर्तमान क्षण ही एकमात्र समय है जिस पर हमारा अधिकार है।',
          author: 'थिक न्हात हान',
        },
        {
          text: 'साँस लें। छोड़ दें। और खुद को याद दिलाएं कि यही एक पल है जिसके बारे में आप निश्चित रूप से जानते हैं कि आपके पास है।',
          author: 'ओप्रा विनफ्रे',
        },
        {
          text: 'स्वयं की देखभाल आत्म-भोग नहीं है। यह आत्म-संरक्षण है।',
          author: 'ऑड्रे लॉर्ड',
        },
        {
          text: 'कठिनाई के बीच में ही अवसर छिपा होता है।',
          author: 'अल्बर्ट आइंस्टीन',
        },
        {
          text: 'खुशी कोई बनी-बनाई चीज़ नहीं है। यह आपके अपने कार्यों से आती है।',
          author: 'दलाई लामा',
        },
        {
          text: 'अपना ख्याल रखना स्वार्थ नहीं है — यह ज़रूरी है।',
          author: 'अज्ञात',
        },
        {
          text: 'आपको हर समय सकारात्मक रहने की ज़रूरत नहीं है। उदास, गुस्सा, चिड़चिड़ा या चिंतित महसूस करना बिल्कुल ठीक है।',
          author: 'लॉरी डेशेन',
        },
        {
          text: 'जहाँ हैं वहीं से शुरू करें। जो है उसका उपयोग करें। जो कर सकते हैं वह करें।',
          author: 'आर्थर ऐश',
        },
        {
          text: 'सबसे अंधेरी रात भी खत्म होगी और सूरज फिर उगेगा।',
          author: 'विक्टर ह्यूगो',
        },
      ],
    },
    feelingsEase: {
      anger: {
        en: 'You\'re allowed to be angry without acting on every impulse it hands you. Give it a body first — a walk, a few hard exhales — before you give it words.',
        ko: '화가 나도 그 충동에 매번 따를 필요는 없어요. 말로 표현하기 전에 먼저 몸을 움직여보세요 — 산책을 하거나 크게 숨을 몇 번 내쉬어 보세요.',
        es: 'Está bien sentir enojo sin actuar según cada impulso que te da. Dale primero un cuerpo — una caminata, unas cuantas exhalaciones fuertes — antes de ponerle palabras.',
        hi: 'आपको गुस्सा आने पर हर आवेग पर काम करने की ज़रूरत नहीं है। इसे शब्द देने से पहले इसे शरीर से जाहिर करें — टहलें, कुछ गहरी साँसें छोड़ें।',
      },
      anxiousness: {
        en: 'You don\'t have to solve every "what if" tonight. Naming one thing you can control right now is usually enough to loosen the loop.',
        ko: '오늘 밤 모든 \'만약에\'를 해결할 필요는 없어요. 지금 당장 통제할 수 있는 한 가지를 말해보는 것만으로도 그 굴레를 느슨하게 하기에 충분해요.',
        es: 'No tienes que resolver cada \'y si\' esta noche. Nombrar una sola cosa que puedes controlar ahora mismo suele bastar para aflojar el bucle.',
        hi: 'आपको आज रात हर \'क्या होगा अगर\' को हल करने की ज़रूरत नहीं है। अभी आप जिस एक चीज़ को नियंत्रित कर सकते हैं उसे नाम देना आमतौर पर इस चक्र को ढीला करने के लिए काफी होता है।',
      },
      burnout: {
        en: 'Rest isn\'t something you earn after finishing everything — it\'s what makes finishing anything possible. One thing can wait.',
        ko: '휴식은 모든 걸 끝낸 뒤에 얻는 보상이 아니라, 무언가를 끝낼 수 있게 해주는 힘이에요. 한 가지 정도는 미뤄도 괜찮아요.',
        es: 'El descanso no es algo que te ganas después de terminar todo — es lo que hace posible terminar cualquier cosa. Una cosa puede esperar.',
        hi: 'आराम कोई ऐसी चीज़ नहीं है जो आप सब कुछ खत्म करने के बाद कमाते हैं — यही वह चीज़ है जो किसी भी काम को पूरा करना संभव बनाती है। एक चीज़ इंतज़ार कर सकती है।',
      },
      fear: {
        en: 'Naming the fear out loud, even just to yourself, takes some of its power away. Ask what\'s actually happening right now, in this room, versus what your mind is predicting.',
        ko: '두려움을 소리 내어 말해보는 것만으로도 — 자신에게라도 — 그 힘이 조금은 줄어들어요. 지금 이 순간 실제로 무슨 일이 일어나고 있는지, 마음이 예측하는 것과 비교해보세요.',
        es: 'Nombrar el miedo en voz alta, aunque sea solo para ti misma, le quita algo de poder. Pregúntate qué está pasando realmente ahora mismo, en este lugar, frente a lo que tu mente está prediciendo.',
        hi: 'डर को ज़ोर से नाम देना, भले ही सिर्फ खुद से, उसकी कुछ ताकत छीन लेता है। पूछें कि अभी, इस कमरे में, वास्तव में क्या हो रहा है — बनाम आपका मन क्या अनुमान लगा रहा है।',
      },
      sadness: {
        en: 'Sadness doesn\'t need to be fixed right away — it needs room. Let yourself feel it for a few minutes without rushing to feel better.',
        ko: '슬픔은 당장 고쳐야 할 문제가 아니라 머물 공간이 필요한 감정이에요. 서둘러 나아지려 하지 말고, 몇 분만이라도 그 감정을 그대로 느껴보세요.',
        es: 'La tristeza no necesita arreglarse de inmediato — necesita espacio. Permítete sentirla unos minutos sin apurarte a sentirte mejor.',
        hi: 'उदासी को तुरंत ठीक करने की ज़रूरत नहीं है — इसे जगह चाहिए। बेहतर महसूस करने की जल्दी किए बिना, खुद को कुछ मिनट इसे महसूस करने दें।',
      },
      insecurity: {
        en: 'The voice doubting you is not a neutral judge — it\'s a scared, old habit of thinking. You\'re allowed to disagree with it.',
        ko: '당신을 의심하는 그 목소리는 공정한 심판이 아니에요 — 그것은 두려움에서 비롯된 오래된 생각 습관일 뿐이에요. 그 목소리에 동의하지 않아도 괜찮아요.',
        es: 'La voz que duda de ti no es un juez neutral — es un viejo hábito de pensamiento asustado. Tienes permiso para no estar de acuerdo con ella.',
        hi: 'जो आवाज़ आप पर शक करती है वह कोई निष्पक्ष जज नहीं है — यह सोचने की एक डरी हुई, पुरानी आदत है। आपको इससे असहमत होने की अनुमति है।',
      },
      loneliness: {
        en: 'Loneliness shrinks with even small, real contact — a text, a call, sitting somewhere with other people around. It doesn\'t need to be solved all at once.',
        ko: '외로움은 작은 진짜 연결만으로도 줄어들어요 — 문자 한 통, 전화 한 통, 사람들 곁에 잠시 앉아 있는 것만으로도요. 한 번에 다 해결할 필요는 없어요.',
        es: 'La soledad disminuye con incluso un pequeño contacto real — un mensaje, una llamada, sentarte en algún lugar rodeada de gente. No necesita resolverse de una sola vez.',
        hi: 'अकेलापन छोटे, असली संपर्क से भी कम हो जाता है — एक संदेश, एक कॉल, कहीं लोगों के बीच बैठना। इसे एक बार में हल करने की ज़रूरत नहीं है।',
      },
      overwhelm: {
        en: 'You don\'t have to hold everything at once. Pick the single smallest next step and let the rest wait its turn.',
        ko: '모든 것을 한꺼번에 짊어질 필요는 없어요. 가장 작은 다음 한 걸음을 골라보고, 나머지는 차례를 기다리게 두세요.',
        es: 'No tienes que sostenerlo todo a la vez. Elige el paso siguiente más pequeño y deja que el resto espere su turno.',
        hi: 'आपको सब कुछ एक साथ संभालने की ज़रूरत नहीं है। सबसे छोटा अगला कदम चुनें और बाकी को अपनी बारी का इंतज़ार करने दें।',
      },
    },
  },
  emotionsCatalog: {
    basicEmotions: {
      happiness: {
        en: 'Happiness',
        ko: '행복',
        es: 'Felicidad',
        hi: 'ख़ुशी',
      },
      sadness: {
        en: 'Sadness',
        ko: '슬픔',
        es: 'Tristeza',
        hi: 'उदासी',
      },
      fear: {
        en: 'Fear',
        ko: '두려움',
        es: 'Miedo',
        hi: 'डर',
      },
      disgust: {
        en: 'Disgust',
        ko: '혐오',
        es: 'Asco',
        hi: 'घृणा',
      },
      anger: {
        en: 'Anger',
        ko: '분노',
        es: 'Enojo',
        hi: 'गुस्सा',
      },
      contempt: {
        en: 'Contempt',
        ko: '경멸',
        es: 'Desprecio',
        hi: 'तिरस्कार',
      },
      surprise: {
        en: 'Surprise',
        ko: '놀람',
        es: 'Sorpresa',
        hi: 'आश्चर्य',
      },
    },
    copingActions: {
      breathing: {
        en: 'Deep breathing',
        ko: '심호흡',
        es: 'Respiración profunda',
        hi: 'गहरी साँस',
      },
      journaling: {
        en: 'Journaling',
        ko: '일기 쓰기',
        es: 'Escribir en el diario',
        hi: 'जर्नलिंग',
      },
      walk: {
        en: 'Walk/exercise',
        ko: '산책/운동',
        es: 'Caminar/ejercicio',
        hi: 'टहलना/व्यायाम',
      },
      call: {
        en: 'Called someone',
        ko: '전화 통화',
        es: 'Llamé a alguien',
        hi: 'किसी को फोन किया',
      },
      rest: {
        en: 'Rest/sleep',
        ko: '휴식/수면',
        es: 'Descanso/dormir',
        hi: 'आराम/नींद',
      },
      music: {
        en: 'Music',
        ko: '음악',
        es: 'Música',
        hi: 'संगीत',
      },
      meditation: {
        en: 'Meditation',
        ko: '명상',
        es: 'Meditación',
        hi: 'ध्यान',
      },
      water: {
        en: 'Drink water',
        ko: '물 마시기',
        es: 'Beber agua',
        hi: 'पानी पिएं',
      },
      grounding: {
        en: '5-4-3-2-1',
        ko: '5-4-3-2-1',
        es: '5-4-3-2-1',
        hi: '5-4-3-2-1',
      },
      nothing: {
        en: 'Nothing yet',
        ko: '아직 없음',
        es: 'Nada todavía',
        hi: 'अभी कुछ नहीं',
      },
    },
    bodyRegions: {
      head: {
        en: 'Head',
        ko: '머리',
        es: 'Cabeza',
        hi: 'सिर',
      },
      throat: {
        en: 'Throat',
        ko: '목',
        es: 'Garganta',
        hi: 'गला',
      },
      chest: {
        en: 'Chest',
        ko: '가슴',
        es: 'Pecho',
        hi: 'छाती',
      },
      stomach: {
        en: 'Stomach',
        ko: '배',
        es: 'Estómago',
        hi: 'पेट',
      },
      shoulders: {
        en: 'Shoulders',
        ko: '어깨',
        es: 'Hombros',
        hi: 'कंधे',
      },
      arms: {
        en: 'Arms',
        ko: '팔',
        es: 'Brazos',
        hi: 'बाहें',
      },
      legs: {
        en: 'Legs',
        ko: '다리',
        es: 'Piernas',
        hi: 'पैर',
      },
      hands: {
        en: 'Hands',
        ko: '손',
        es: 'Manos',
        hi: 'हाथ',
      },
    },
  },
  feelingsLibraryContent: {
    anger: {
      label: {
        en: 'Anger',
        ko: '분노',
        es: 'Enojo',
        hi: 'गुस्सा',
      },
      notice: {
        en: 'A short fuse, a clenched jaw, snapping at things that wouldn\'t normally bother you. It often arrives fast and wants to be acted on immediately.',
        ko: '짧은 도화선, 굳게 다문 턱, 평소라면 신경 쓰지 않았을 일에도 날카롭게 반응하게 돼요. 보통 빠르게 찾아오고 즉각 행동으로 옮기고 싶어져요.',
        es: 'Un fusible corto, mandíbula apretada, reaccionar bruscamente ante cosas que normalmente no te molestarían. Suele llegar rápido y quiere ser actuado de inmediato.',
        hi: 'छोटा धैर्य, भिंची हुई जबड़ा, ऐसी चीज़ों पर भड़क जाना जो सामान्यतः परेशान नहीं करतीं। यह अक्सर तेज़ी से आता है और तुरंत उस पर काम करना चाहता है।',
      },
      hear: {
        en: 'Anger usually says "this isn\'t fair" or "I have to fix this right now." It\'s protecting a boundary that got crossed, even if the target of your anger isn\'t the real cause.',
        ko: '분노는 대개 "이건 불공평해" 또는 "지금 당장 바로잡아야 해"라고 말해요. 화의 대상이 진짜 원인이 아니더라도, 이는 침범당한 경계를 지키려는 신호예요.',
        es: 'El enojo suele decir "esto no es justo" o "tengo que arreglar esto ahora mismo". Está protegiendo un límite que fue cruzado, aunque el objetivo de tu enojo no sea la causa real.',
        hi: 'गुस्सा आमतौर पर कहता है "यह उचित नहीं है" या "मुझे अभी इसे ठीक करना है।" यह किसी टूटी हुई सीमा की रक्षा कर रहा होता है, भले ही आपके गुस्से का निशाना असली वजह न हो।',
      },
      feel: {
        en: 'Heat in the chest and face, tight fists or jaw, a racing pulse, an urge to move or speak sharply.',
        ko: '가슴과 얼굴의 열감, 꽉 쥔 주먹이나 턱, 빨라지는 맥박, 움직이거나 날카롭게 말하고 싶은 충동.',
        es: 'Calor en el pecho y la cara, puños o mandíbula apretados, pulso acelerado, un impulso de moverte o hablar con brusquedad.',
        hi: 'छाती और चेहरे में गर्मी, कसी हुई मुट्ठियाँ या जबड़ा, तेज़ धड़कन, हिलने या तीखा बोलने की इच्छा।',
      },
      explore: {
        en: [
          'What boundary feels crossed right now — and is it really this moment, or something older?',
          'If you said the honest version of what you\'re thinking, what would it be?',
          'What would "handled" actually look like a day from now?',
        ],
        ko: [
          '지금 느껴지는 경계 침범은 정말 지금 이 순간의 일인가요, 아니면 더 오래된 무언가인가요?',
          '지금 생각하는 것을 솔직하게 말한다면 무엇일까요?',
          '하루 뒤에 "해결됐다"는 건 실제로 어떤 모습일까요?',
        ],
        es: [
          '¿Qué límite sientes que fue cruzado ahora mismo — y es realmente este momento, o algo más antiguo?',
          'Si dijeras la versión honesta de lo que estás pensando, ¿cuál sería?',
          '¿Cómo se vería realmente "resuelto" dentro de un día?',
        ],
        hi: [
          'अभी किस सीमा का उल्लंघन महसूस हो रहा है — और क्या यह सच में अभी की बात है, या कुछ पुरानी?',
          'अगर आप जो सोच रहे हैं उसका ईमानदार संस्करण कहें, तो वह क्या होगा?',
          'एक दिन बाद "सुलझा हुआ" असल में कैसा दिखेगा?',
        ],
      },
    },
    anxiousness: {
      label: {
        en: 'Anxiousness',
        ko: '불안',
        es: 'Ansiedad',
        hi: 'चिंता',
      },
      notice: {
        en: 'Racing thoughts that jump between worst-case scenarios, restlessness, checking things over and over, trouble settling on one task.',
        ko: '최악의 시나리오 사이를 오가는 질주하는 생각들, 안절부절못함, 반복해서 확인하기, 한 가지 일에 집중하기 어려움.',
        es: 'Pensamientos acelerados que saltan entre los peores escenarios, inquietud, revisar las cosas una y otra vez, dificultad para concentrarte en una sola tarea.',
        hi: 'सबसे बुरी संभावनाओं के बीच कूदते तेज़ विचार, बेचैनी, बार-बार चीज़ें जांचना, किसी एक काम पर टिक न पाना।',
      },
      hear: {
        en: 'Anxiousness tends to say "what if" on a loop. It\'s trying to prepare you for danger by rehearsing every version of it in advance.',
        ko: '불안은 보통 "만약에"를 반복해서 말해요. 모든 위험의 버전을 미리 연습시켜서 당신을 대비시키려는 거예요.',
        es: 'La ansiedad tiende a decir "y si" en bucle. Está tratando de prepararte para el peligro ensayando cada versión posible de antemano.',
        hi: 'चिंता अक्सर "क्या होगा अगर" को दोहराती रहती है। यह हर संभावित खतरे का पूर्वाभ्यास करके आपको तैयार करने की कोशिश कर रही है।',
      },
      feel: {
        en: 'A fluttering or tight stomach, shallow breathing, a jittery or wired feeling in the limbs.',
        ko: '속이 두근거리거나 답답함, 얕은 호흡, 팔다리의 불안정하거나 들뜬 느낌.',
        es: 'Un estómago revuelto o tenso, respiración superficial, una sensación nerviosa o acelerada en las extremidades.',
        hi: 'पेट में फड़फड़ाहट या कसाव, उथली साँसें, हाथ-पैरों में घबराई या बेचैन भावना।',
      },
      explore: {
        en: [
          'Which part of this worry is actually within your control today?',
          'What\'s the story your mind is telling, and what evidence actually supports it?',
          'What has helped you get through uncertainty before?',
        ],
        ko: [
          '이 걱정 중 오늘 당신이 실제로 통제할 수 있는 부분은 무엇인가요?',
          '마음이 들려주는 이야기는 무엇이고, 실제로 그것을 뒷받침하는 증거는 무엇인가요?',
          '예전에 불확실함을 이겨내는 데 도움이 됐던 것은 무엇이었나요?',
        ],
        es: [
          '¿Qué parte de esta preocupación está realmente bajo tu control hoy?',
          '¿Cuál es la historia que tu mente te está contando, y qué evidencia la respalda realmente?',
          '¿Qué te ha ayudado a superar la incertidumbre antes?',
        ],
        hi: [
          'इस चिंता का कौन-सा हिस्सा वाकई आज आपके नियंत्रण में है?',
          'आपका मन जो कहानी सुना रहा है वह क्या है, और उसे कौन-सा सबूत वाकई साबित करता है?',
          'पहले अनिश्चितता से निकलने में आपकी क्या मदद मिली थी?',
        ],
      },
    },
    burnout: {
      label: {
        en: 'Burnout',
        ko: '번아웃',
        es: 'Agotamiento',
        hi: 'बर्नआउट',
      },
      notice: {
        en: 'Flatness where drive used to be, dragging through tasks you normally handle easily, a sense that even rest doesn\'t refill you.',
        ko: '예전엔 있던 의욕이 사라진 무기력함, 평소엔 쉽게 하던 일도 힘겹게 끌고 가는 느낌, 쉬어도 채워지지 않는 느낌.',
        es: 'Una sensación de vacío donde antes había impulso, arrastrarte por tareas que normalmente manejas con facilidad, la sensación de que ni siquiera el descanso te recarga.',
        hi: 'जहाँ पहले जोश था वहाँ अब सपाटपन, आसान लगने वाले कामों को भी घसीटते हुए करना, यह महसूस होना कि आराम भी भर नहीं पाता।',
      },
      hear: {
        en: 'Burnout says "I should be able to keep going" long after the tank is empty. It mistakes exhaustion for a character flaw instead of a signal.',
        ko: '번아웃은 "계속할 수 있어야 해"라고 오랫동안 말하지만, 이미 에너지는 바닥난 상태예요. 지쳐 있는 것을 신호가 아니라 성격 결함으로 착각하게 만들어요.',
        es: 'El agotamiento dice "debería poder seguir adelante" mucho después de que el tanque está vacío. Confunde el cansancio con un defecto de carácter en lugar de una señal.',
        hi: 'बर्नआउट कहता है "मुझे चलते रहना चाहिए" — टैंक खाली होने के बहुत बाद तक। यह थकान को चरित्र की कमी समझ बैठता है, जबकि यह एक संकेत है।',
      },
      feel: {
        en: 'Heaviness in the limbs, foggy thinking, a dull ache behind the eyes, low motivation even for things you enjoy.',
        ko: '팔다리의 무거움, 흐릿한 사고, 눈 뒤의 둔한 통증, 좋아하는 일에도 낮은 의욕.',
        es: 'Pesadez en las extremidades, pensamiento nublado, un dolor sordo detrás de los ojos, poca motivación incluso para cosas que disfrutas.',
        hi: 'अंगों में भारीपन, धुंधली सोच, आँखों के पीछे हल्का दर्द, पसंदीदा चीज़ों के लिए भी कम प्रेरणा।',
      },
      explore: {
        en: [
          'What has quietly been non-negotiable that could actually be renegotiated?',
          'When did you last feel like yourself, and what was different that day?',
          'If you gave yourself permission to do less this week, what would you drop first?',
        ],
        ko: [
          '조용히 "당연한 일"이 되어버렸지만 사실 다시 협상할 수 있는 것은 무엇인가요?',
          '가장 최근에 나다운 느낌이 들었던 건 언제였고, 그날 무엇이 달랐나요?',
          '이번 주에 조금 덜 해도 괜찮다고 스스로에게 허락한다면, 무엇을 가장 먼저 내려놓을까요?',
        ],
        es: [
          '¿Qué se ha vuelto silenciosamente innegociable pero en realidad podría renegociarse?',
          '¿Cuándo fue la última vez que te sentiste como tú misma, y qué fue diferente ese día?',
          'Si te dieras permiso para hacer menos esta semana, ¿qué soltarías primero?',
        ],
        hi: [
          'चुपचाप क्या "अनिवार्य" बन गया है जिस पर असल में फिर से बात हो सकती है?',
          'आखिरी बार आपको खुद जैसा कब महसूस हुआ था, और उस दिन क्या अलग था?',
          'अगर आप इस हफ्ते खुद को कम करने की इजाज़त दें, तो सबसे पहले क्या छोड़ेंगे?',
        ],
      },
    },
    fear: {
      label: {
        en: 'Fear',
        ko: '두려움',
        es: 'Miedo',
        hi: 'डर',
      },
      notice: {
        en: 'A sudden alertness, wanting to avoid or escape a specific situation, a mind that keeps circling back to the threat.',
        ko: '갑작스러운 경계심, 특정 상황을 피하거나 벗어나고 싶은 마음, 계속 위협으로 되돌아가는 생각.',
        es: 'Una alerta repentina, querer evitar o escapar de una situación específica, una mente que sigue volviendo a la amenaza.',
        hi: 'अचानक सतर्कता, किसी खास स्थिति से बचना या भाग जाना चाहना, ऐसा मन जो बार-बार खतरे की ओर लौटता है।',
      },
      hear: {
        en: 'Fear says "this could hurt me" and narrows your focus to the danger. It\'s an old, fast system trying to keep you safe, even when the threat is more uncertain than physical.',
        ko: '두려움은 "이건 나를 다치게 할 수 있어"라고 말하며 초점을 위협에 좁혀요. 위협이 신체적이라기보다 불확실한 것이라 해도, 당신을 안전하게 지키려는 오래되고 빠른 시스템이에요.',
        es: 'El miedo dice "esto podría hacerme daño" y estrecha tu enfoque hacia el peligro. Es un sistema antiguo y rápido que trata de mantenerte a salvo, incluso cuando la amenaza es más incierta que física.',
        hi: 'डर कहता है "यह मुझे नुकसान पहुँचा सकता है" और आपका ध्यान खतरे पर केंद्रित कर देता है। यह एक पुराना, तेज़ सिस्टम है जो आपको सुरक्षित रखने की कोशिश करता है, भले ही खतरा शारीरिक से ज़्यादा अनिश्चित हो।',
      },
      feel: {
        en: 'A jolt in the chest, cold hands, a held breath, muscles ready to move.',
        ko: '가슴의 찌릿함, 차가운 손, 멈춘 숨, 움직일 준비가 된 근육.',
        es: 'Un sobresalto en el pecho, manos frías, la respiración contenida, músculos listos para moverse.',
        hi: 'छाती में झटका, ठंडे हाथ, रुकी हुई साँस, हिलने के लिए तैयार मांसपेशियाँ।',
      },
      explore: {
        en: [
          'What specifically are you afraid will happen, in concrete terms?',
          'Has this fear been right before, or does it tend to overestimate the danger?',
          'What\'s one small step toward the thing you\'re avoiding?',
        ],
        ko: [
          '구체적으로 무엇이 일어날까 봐 두려운가요?',
          '이 두려움이 예전에 맞았던 적이 있나요, 아니면 위험을 과대평가하는 경향이 있나요?',
          '피하고 있는 그 일을 향한 작은 한 걸음은 무엇일까요?',
        ],
        es: [
          '¿Qué específicamente temes que suceda, en términos concretos?',
          '¿Este miedo ha acertado antes, o tiende a sobreestimar el peligro?',
          '¿Cuál sería un pequeño paso hacia lo que estás evitando?',
        ],
        hi: [
          'ठोस शब्दों में, आपको वास्तव में किस बात का डर है कि क्या होगा?',
          'क्या यह डर पहले सही साबित हुआ है, या यह खतरे को बढ़ा-चढ़ाकर आंकता है?',
          'जिस चीज़ से आप बच रहे हैं, उसकी ओर एक छोटा कदम क्या हो सकता है?',
        ],
      },
    },
    sadness: {
      label: {
        en: 'Sadness',
        ko: '슬픔',
        es: 'Tristeza',
        hi: 'उदासी',
      },
      notice: {
        en: 'Low energy, tearfulness, wanting to withdraw or go quiet, things that used to feel light now feeling heavy.',
        ko: '낮은 에너지, 눈물, 물러나거나 조용해지고 싶은 마음, 예전엔 가볍게 느껴지던 것들이 무겁게 느껴짐.',
        es: 'Poca energía, ganas de llorar, querer retraerte o quedarte en silencio, cosas que antes se sentían ligeras ahora se sienten pesadas.',
        hi: 'कम ऊर्जा, आँसू आना, पीछे हटना या चुप हो जाना चाहना, जो चीज़ें पहले हल्की लगती थीं वे अब भारी लगना।',
      },
      hear: {
        en: 'Sadness says "something mattered and it\'s gone, or going." It\'s the natural response to loss, even loss that\'s hard to name.',
        ko: '슬픔은 "무언가가 중요했고, 그것이 사라지고 있다"고 말해요. 이름 붙이기 어려운 상실이라도, 상실에 대한 자연스러운 반응이에요.',
        es: 'La tristeza dice "algo importaba y se está yendo, o ya se fue". Es la respuesta natural a la pérdida, incluso una pérdida difícil de nombrar.',
        hi: 'उदासी कहती है "कुछ मायने रखता था और वह जा रहा है, या जा चुका है।" यह हानि की स्वाभाविक प्रतिक्रिया है, भले ही उस हानि को नाम देना मुश्किल हो।',
      },
      feel: {
        en: 'A heaviness in the chest, a lump in the throat, tired eyes, a slower body.',
        ko: '가슴의 무거움, 목이 메는 느낌, 피곤한 눈, 느려진 몸.',
        es: 'Pesadez en el pecho, un nudo en la garganta, ojos cansados, un cuerpo más lento.',
        hi: 'छाती में भारीपन, गले में गांठ, थकी हुई आँखें, धीमा शरीर।',
      },
      explore: {
        en: [
          'What, specifically, feels like it\'s been lost?',
          'Who or what would help just by being nearby right now?',
          'What would comfort — not distraction — look like today?',
        ],
        ko: [
          '구체적으로 무엇을 잃어버린 것처럼 느껴지나요?',
          '지금 그저 곁에 있어주는 것만으로 도움이 될 사람이나 무언가는 누구인가요?',
          '오늘, 주의를 돌리는 것이 아니라 진짜 위로는 어떤 모습일까요?',
        ],
        es: [
          '¿Qué, específicamente, sientes que se ha perdido?',
          '¿Quién o qué te ayudaría con solo estar cerca en este momento?',
          '¿Cómo se vería el consuelo — no la distracción — hoy?',
        ],
        hi: [
          'ठीक-ठीक क्या खोया हुआ महसूस हो रहा है?',
          'अभी कौन या क्या सिर्फ पास होने से मदद करेगा?',
          'आज दिलासा — भटकाव नहीं — कैसा दिखेगा?',
        ],
      },
    },
    insecurity: {
      label: {
        en: 'Insecurity',
        ko: '불안정감',
        es: 'Inseguridad',
        hi: 'असुरक्षा',
      },
      notice: {
        en: 'Second-guessing your choices, comparing yourself to others, a voice that finds fault before anyone else does.',
        ko: '자신의 선택을 계속 의심하기, 다른 사람과 비교하기, 누구보다 먼저 흠을 찾아내는 목소리.',
        es: 'Dudar constantemente de tus decisiones, compararte con otros, una voz que encuentra fallas antes que nadie más.',
        hi: 'अपने फैसलों पर बार-बार शक करना, खुद की दूसरों से तुलना करना, ऐसी आवाज़ जो किसी और से पहले खामी ढूंढ लेती है।',
      },
      hear: {
        en: 'Insecurity says "you\'re not enough" or "they\'ll find out." It\'s often an old fear of not belonging, wearing the costume of self-criticism.',
        ko: '불안정감은 "넌 부족해" 또는 "들킬 거야"라고 말해요. 종종 소속되지 못할 것 같은 오래된 두려움이 자기비판의 옷을 입은 거예요.',
        es: 'La inseguridad dice "no eres suficiente" o "se van a dar cuenta". A menudo es un viejo miedo a no pertenecer, disfrazado de autocrítica.',
        hi: 'असुरक्षा कहती है "तुम काफी नहीं हो" या "उन्हें पता चल जाएगा।" यह अक्सर न जुड़ पाने के पुराने डर का ही आत्म-आलोचना का रूप होता है।',
      },
      feel: {
        en: 'A sinking feeling in the stomach, shrinking posture, warmth in the face (shame\'s close cousin).',
        ko: '속이 가라앉는 느낌, 움츠러든 자세, 얼굴의 화끈거림 (수치심과 사촌 관계).',
        es: 'Una sensación de hundimiento en el estómago, postura encogida, calor en la cara (prima cercana de la vergüenza).',
        hi: 'पेट में डूबने जैसा एहसास, सिकुड़ी हुई मुद्रा, चेहरे में गर्माहट (शर्म की करीबी रिश्तेदार)।',
      },
      explore: {
        en: [
          'Whose voice does this criticism actually sound like?',
          'What would you say to a friend who felt exactly this way?',
          'What\'s one piece of real evidence that contradicts the doubt?',
        ],
        ko: [
          '이 비판은 실제로 누구의 목소리처럼 들리나요?',
          '똑같이 느끼는 친구에게는 뭐라고 말해줄 건가요?',
          '그 의심에 반박할 만한 진짜 증거 하나는 무엇인가요?',
        ],
        es: [
          '¿A quién se parece realmente esta crítica?',
          '¿Qué le dirías a una amiga que se sintiera exactamente así?',
          '¿Cuál es una prueba real que contradice la duda?',
        ],
        hi: [
          'यह आलोचना असल में किसकी आवाज़ जैसी लगती है?',
          'अगर कोई दोस्त बिल्कुल ऐसा ही महसूस करे तो आप उससे क्या कहेंगे?',
          'इस शक के खिलाफ एक असली सबूत क्या है?',
        ],
      },
    },
    loneliness: {
      label: {
        en: 'Loneliness',
        ko: '외로움',
        es: 'Soledad',
        hi: 'अकेलापन',
      },
      notice: {
        en: 'A quiet ache even around other people, a pull to isolate further, a sense of being unseen or unreachable.',
        ko: '사람들 곁에 있어도 느껴지는 조용한 아픔, 더 고립되고 싶은 끌림, 보이지 않거나 닿을 수 없다는 느낌.',
        es: 'Un dolor silencioso incluso rodeada de otras personas, un impulso de aislarte aún más, sentirte invisible o inalcanzable.',
        hi: 'दूसरों के बीच रहते हुए भी एक शांत दर्द, और अलग-थलग होने की खिंचाव, अनदेखा या अपहुँच महसूस होना।',
      },
      hear: {
        en: 'Loneliness says "no one really gets it" or "I\'m on my own here." It\'s a signal that connection is missing, not proof that it\'s unavailable.',
        ko: '외로움은 "아무도 진짜로 이해하지 못해" 또는 "나 혼자야"라고 말해요. 이는 연결이 없다는 증거가 아니라 연결이 부족하다는 신호예요.',
        es: 'La soledad dice "nadie realmente lo entiende" o "estoy sola en esto". Es una señal de que falta conexión, no una prueba de que no está disponible.',
        hi: 'अकेलापन कहता है "कोई वाकई इसे नहीं समझता" या "मैं यहाँ अकेला हूँ।" यह इस बात का संकेत है कि जुड़ाव की कमी है, इस बात का सबूत नहीं कि वह उपलब्ध नहीं है।',
      },
      feel: {
        en: 'A hollow feeling in the chest, low energy, a heaviness that settles in quiet moments.',
        ko: '가슴의 공허함, 낮은 에너지, 조용한 순간에 내려앉는 무거움.',
        es: 'Una sensación de vacío en el pecho, poca energía, una pesadez que se instala en los momentos de silencio.',
        hi: 'छाती में खालीपन, कम ऊर्जा, शांत पलों में बैठने वाला भारीपन।',
      },
      explore: {
        en: [
          'Who is one person you could reach out to today, even briefly?',
          'When did you last feel truly understood, and what made that possible?',
          'Is this loneliness about being alone, or about feeling unseen?',
        ],
        ko: [
          '오늘 잠깐이라도 연락할 수 있는 한 사람은 누구인가요?',
          '마지막으로 진심으로 이해받는다고 느낀 건 언제였고, 무엇이 그걸 가능하게 했나요?',
          '이 외로움은 혼자라는 것에 관한 것인가요, 아니면 보이지 않는다는 느낌에 관한 것인가요?',
        ],
        es: [
          '¿A quién podrías contactar hoy, aunque sea brevemente?',
          '¿Cuándo fue la última vez que te sentiste verdaderamente comprendida, y qué lo hizo posible?',
          '¿Esta soledad es sobre estar sola, o sobre sentirte invisible?',
        ],
        hi: [
          'आज आप किस एक व्यक्ति से, भले ही थोड़ी देर के लिए, संपर्क कर सकते हैं?',
          'आखिरी बार आपने सच में समझा हुआ कब महसूस किया था, और उसे किसने संभव बनाया?',
          'क्या यह अकेलापन अकेले होने के बारे में है, या अनदेखा महसूस करने के बारे में?',
        ],
      },
    },
    overwhelm: {
      label: {
        en: 'Overwhelm',
        ko: '압도됨',
        es: 'Agobio',
        hi: 'अभिभूत होना',
      },
      notice: {
        en: 'Too many things pulling at once, difficulty deciding where to start, a foggy or frozen feeling instead of clear thinking.',
        ko: '한꺼번에 몰려드는 많은 일들, 어디서부터 시작해야 할지 결정하기 어려움, 명확한 사고 대신 흐릿하거나 얼어붙은 느낌.',
        es: 'Demasiadas cosas tirando de ti a la vez, dificultad para decidir por dónde empezar, una sensación de niebla o bloqueo en lugar de pensar con claridad.',
        hi: 'एक साथ बहुत सारी चीज़ों का खिंचाव, यह तय करना मुश्किल कि कहाँ से शुरू करें, स्पष्ट सोच की जगह धुंधलापन या जमा हुआ महसूस होना।',
      },
      hear: {
        en: 'Overwhelm says "there\'s too much and not enough of me." It\'s not that you can\'t handle things — it\'s that too many things are asking for attention at the same time.',
        ko: '압도됨은 "할 일은 너무 많고 나는 너무 적어"라고 말해요. 감당할 수 없다는 게 아니라, 너무 많은 것들이 동시에 관심을 요구하고 있다는 뜻이에요.',
        es: 'El agobio dice "hay demasiado y no hay suficiente de mí". No es que no puedas con las cosas — es que demasiadas cosas están pidiendo atención al mismo tiempo.',
        hi: 'अभिभूत होना कहता है "बहुत कुछ है और मैं काफी नहीं हूँ।" यह ऐसा नहीं कि आप संभाल नहीं सकते — बल्कि बहुत सारी चीज़ें एक साथ ध्यान माँग रही हैं।',
      },
      feel: {
        en: 'A tight chest, shallow breathing, a buzzing or scattered feeling in the head, restlessness or freezing.',
        ko: '답답한 가슴, 얕은 호흡, 머릿속의 웅웅거리거나 흩어지는 느낌, 안절부절못함 또는 얼어붙음.',
        es: 'Pecho apretado, respiración superficial, una sensación de zumbido o dispersión en la cabeza, inquietud o congelamiento.',
        hi: 'जकड़ी हुई छाती, उथली साँसें, सिर में भिनभिनाहट या बिखरा हुआ एहसास, बेचैनी या जम जाना।',
      },
      explore: {
        en: [
          'If you could only do one thing today, what would actually matter most?',
          'What\'s something on your plate that could be delayed, dropped, or handed off?',
          'What would it feel like to do this imperfectly instead of not at all?',
        ],
        ko: [
          '오늘 딱 한 가지만 할 수 있다면, 실제로 가장 중요한 건 무엇일까요?',
          '미루거나, 그만두거나, 넘겨줄 수 있는 일은 무엇인가요?',
          '완벽하지 않게라도 이 일을 하는 게 아예 안 하는 것보다 어떤 느낌일까요?',
        ],
        es: [
          'Si solo pudieras hacer una cosa hoy, ¿qué es lo que realmente importaría más?',
          '¿Qué hay en tu plato que podría postergarse, dejarse o delegarse?',
          '¿Cómo se sentiría hacer esto de forma imperfecta en lugar de no hacerlo en absoluto?',
        ],
        hi: [
          'अगर आज आप सिर्फ एक काम कर पाएँ, तो असल में सबसे ज़्यादा मायने क्या रखेगा?',
          'आपकी सूची में क्या ऐसा है जिसे टाला, छोड़ा या सौंपा जा सकता है?',
          'इसे अधूरे तरीके से करना, बिल्कुल न करने से कैसा महसूस होगा?',
        ],
      },
    },
  },
};

export type Translations = Delocalize<typeof SOURCE>;

export const TRANSLATIONS: Record<Locale, Translations> = {
  en: resolve(SOURCE, 'en'),
  ko: resolve(SOURCE, 'ko'),
  es: resolve(SOURCE, 'es'),
  hi: resolve(SOURCE, 'hi'),
};
