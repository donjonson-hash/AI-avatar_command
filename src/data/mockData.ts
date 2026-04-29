export interface OceanProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Founder' | 'Developer' | 'Designer' | 'Investor' | 'Product Manager';
  location: string;
  bio: string;
  skills: string[];
  ocean: OceanProfile;
  avatar: string;
  githubProjects: string[];
  experience: string[];
  compatibility?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  isAiSuggestion?: boolean;
}

export interface Conversation {
  id: string;
  partner: UserProfile;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Алексей Воронов',
    role: 'Developer',
    location: 'Москва, Россия',
    bio: 'Fullstack разработчик с 8-летним опытом. Специализируюсь на AI/ML инфраструктуре и high-load системах. Ищу сооснователя с сильными навыками в продажах и бизнес-развитии.',
    skills: ['Python', 'PyTorch', 'Kubernetes', 'Rust', 'PostgreSQL', 'FastAPI'],
    ocean: { openness: 78, conscientiousness: 92, extraversion: 42, agreeableness: 55, neuroticism: 35 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['neural-search-engine', 'distributed-cache', 'ml-pipeline-orchestrator'],
    experience: ['Senior Engineer @ Yandex', 'Tech Lead @ Sber AI', 'Open Source Contributor @ PyTorch'],
  },
  {
    id: '2',
    name: 'Марина Соколова',
    role: 'Founder',
    location: 'Санкт-Петербург, Россия',
    bio: 'Serial entrepreneur, два exit-а в EdTech. Ищу технического сооснователя для запуска AI-powered платформы обучения.',
    skills: ['Business Strategy', 'Fundraising', 'Product Management', 'Marketing', 'Sales'],
    ocean: { openness: 85, conscientiousness: 88, extraversion: 82, agreeableness: 70, neuroticism: 48 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: [],
    experience: ['CEO @ EduTech Startup (acquired)', 'Co-founder @ SkillBridge', 'McKinsey Digital'],
  },
  {
    id: '3',
    name: 'Дмитрий Козлов',
    role: 'Designer',
    location: 'Берлин, Германия',
    bio: 'Product Designer с фокусом на AI-интерфейсах. Создаю дизайн-системы для сложных технических продуктов.',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'Motion Design', 'Framer'],
    ocean: { openness: 91, conscientiousness: 72, extraversion: 65, agreeableness: 78, neuroticism: 52 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['ai-design-toolkit', 'motion-system'],
    experience: ['Lead Designer @ Stripe', 'Design Director @ Figma (contract)', 'Freelance (Fortune 500 clients)'],
  },
  {
    id: '4',
    name: 'Анна Петрова',
    role: 'Investor',
    location: 'Дубай, ОАЭ',
    bio: 'Angel investor и венчурный аналитик. Инвестирую в pre-seed AI стартапы. Помогаю командам с go-to-market стратегией.',
    skills: ['Venture Capital', 'Financial Modeling', 'Due Diligence', 'Strategy', 'Networking'],
    ocean: { openness: 74, conscientiousness: 90, extraversion: 88, agreeableness: 62, neuroticism: 40 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: [],
    experience: ['Partner @ Antler VC', 'Investment Analyst @ SoftBank', 'Strategy @ BCG'],
  },
  {
    id: '5',
    name: 'Иван Новиков',
    role: 'Product Manager',
    location: 'Лондон, UK',
    bio: 'Technical PM с ML background. Строю продукты от zero-to-one. Ищу команду для запуска cybersecurity AI.',
    skills: ['Product Strategy', 'Python', 'Data Analysis', 'Agile', 'SQL', 'TensorFlow'],
    ocean: { openness: 80, conscientiousness: 85, extraversion: 75, agreeableness: 68, neuroticism: 45 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['threat-detection-model', 'product-metrics-dashboard'],
    experience: ['PM @ Palantir', 'Product Lead @ Darktrace', 'Engineer @ Google'],
  },
  {
    id: '6',
    name: 'София Лебедева',
    role: 'Developer',
    location: 'Алматы, Казахстан',
    bio: 'Mobile разработчик (iOS/Android). Создаю нативные приложения с focus on performance. Ищу backend co-founder.',
    skills: ['Swift', 'Kotlin', 'Jetpack Compose', 'SwiftUI', 'Firebase', 'GraphQL'],
    ocean: { openness: 70, conscientiousness: 88, extraversion: 58, agreeableness: 72, neuroticism: 38 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['ios-ml-kit', 'compose-animation-lib', 'mobile-boilerplate'],
    experience: ['Senior Mobile Dev @ Kaspi', 'iOS Lead @ Yandex Go', 'Freelance (20+ apps shipped)'],
  },
  {
    id: '7',
    name: 'Никита Громов',
    role: 'Developer',
    location: 'Тбилиси, Грузия',
    bio: 'Blockchain + AI engineer. Разрабатываю decentralized ML training protocols. Ищу co-founder с экономическим образованием.',
    skills: ['Solidity', 'Rust', 'Python', 'Zero-Knowledge Proofs', 'Ethereum', 'IPFS'],
    ocean: { openness: 95, conscientiousness: 78, extraversion: 50, agreeableness: 48, neuroticism: 55 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['zk-ml-marketplace', 'decentralized-training', 'privacy-preserving-inference'],
    experience: ['Blockchain Engineer @ Ethereum Foundation', 'Researcher @ Protocol Labs', 'CTO @ DeFi Startup'],
  },
  {
    id: '8',
    name: 'Елена Волкова',
    role: 'Designer',
    location: 'Прага, Чехия',
    bio: 'Brand & Identity designer для технологических стартапов. Создаю визуальные языки, которые запоминаются.',
    skills: ['Brand Design', 'Illustration', '3D Design', 'Blender', 'After Effects', 'Figma'],
    ocean: { openness: 88, conscientiousness: 76, extraversion: 70, agreeableness: 82, neuroticism: 60 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['design-system-starter', 'brand-kit-generator'],
    experience: ['Brand Designer @ Notion', 'Creative Director @ Linear (contract)', 'Freelance (50+ startups)'],
  },
  {
    id: '9',
    name: 'Максим Орлов',
    role: 'Founder',
    location: 'Астана, Казахстан',
    bio: 'Опытный founder в fintech. Прошел YC W22. Ищу технического co-founder для нового AI-fintech проекта.',
    skills: ['Fintech', 'Regulation', 'Fundraising', 'Team Building', 'Strategy', 'B2B Sales'],
    ocean: { openness: 72, conscientiousness: 94, extraversion: 86, agreeableness: 65, neuroticism: 42 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: [],
    experience: ['Co-founder @ YC-backed startup', 'CEO @ BankTech (Series B)', 'VP @ Goldman Sachs'],
  },
  {
    id: '10',
    name: 'Ольга Смирнова',
    role: 'Developer',
    location: 'Таллин, Эстония',
    bio: 'DevOps/SRE engineer с passion for developer experience. Создаю инфраструктуру, которая масштабируется.',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Go', 'CI/CD', 'Observability'],
    ocean: { openness: 68, conscientiousness: 96, extraversion: 45, agreeableness: 60, neuroticism: 35 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['k8s-gitops-template', 'terraform-modules', 'observability-stack'],
    experience: ['SRE @ Spotify', 'Platform Engineer @ Netflix', 'Consultant @ AWS'],
  },
  {
    id: '11',
    name: 'Артём Павлов',
    role: 'Product Manager',
    location: 'Бангкок, Таиланд',
    bio: 'Growth PM с опытом в emerging markets. Строю продукты для Азии и Африки.',
    skills: ['Growth Hacking', 'Data Analytics', 'A/B Testing', 'SQL', 'Python', 'Localization'],
    ocean: { openness: 82, conscientiousness: 80, extraversion: 90, agreeableness: 55, neuroticism: 50 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['growth-experiment-tracker', 'localization-automation'],
    experience: ['Growth PM @ Grab', 'Product @ Gojek', 'Analyst @ Tencent'],
  },
  {
    id: '12',
    name: 'Татьяна Морозова',
    role: 'Developer',
    location: 'Белград, Сербия',
    bio: 'Frontend engineer, специализируюсь на сложных интерфейсах и real-time приложениях.',
    skills: ['React', 'TypeScript', 'WebRTC', 'WebGL', 'Three.js', 'Rust/WASM'],
    ocean: { openness: 86, conscientiousness: 84, extraversion: 62, agreeableness: 74, neuroticism: 44 },
    avatar: '/avatar-placeholder.jpg',
    githubProjects: ['real-time-collab-engine', 'webrtc-mesh-network', '3d-avatar-render'],
    experience: ['Staff Engineer @ Vercel', 'Frontend Lead @ Figma', 'Core Contributor @ React'],
  },
  {
    // ── KRISTINA — Lead Project Manager, Syndi-AI ──────────────────────────
    // Руководитель проекта. Координирует команду агентов Syndi-AI:
    // DevOps, Frontend, Analytics, Backend, Design.
    // Специализация: AI Product Management, Agile-оркестрация, стратегия развития.
    id: '13',
    name: 'Кристина',
    role: 'Product Manager',
    location: 'Москва, Россия',
    bio: 'Руководитель AI-проектов и лид команды Syndi-AI. Координирую разработку, управляю бэклогом и расставляю приоритеты между агентами. Специализация — запуск AI-продуктов от идеи до production.',
    skills: [
      'AI Project Management',
      'Team Leadership',
      'Product Roadmapping',
      'Agile / Scrum',
      'OKR Strategy',
      'Stakeholder Communication',
      'DeepSeek API',
      'GitHub Workflow',
    ],
    ocean: {
      openness: 88,          // гибкость мышления, принятие новых технологий
      conscientiousness: 95, // высочайшая организованность — ключ для PM
      extraversion: 80,      // уверенная коммуникация с командой
      agreeableness: 75,     // умеет договариваться, не теряя позиции
      neuroticism: 22,       // стрессоустойчивость под давлением дедлайнов
    },
    avatar: '/kristina-avatar.jpg',
    githubProjects: ['Syndi-AI', 'AI-avatar_command'],
    experience: [
      'Lead PM @ Syndi-AI (текущее)',
      'Product Director @ AI Startup (Москва)',
      'Agile Coach @ Sber Tech',
      'Project Manager @ Yandex Cloud',
    ],
  },
];

export const CURRENT_USER: UserProfile = {
  id: 'me',
  name: 'Вы',
  role: 'Founder',
  location: 'Москва, Россия',
  bio: 'Заполняется после прохождения онбординга',
  skills: [],
  ocean: { openness: 75, conscientiousness: 80, extraversion: 65, agreeableness: 70, neuroticism: 50 },
  avatar: '/avatar-placeholder.jpg',
  githubProjects: [],
  experience: [],
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    partner: MOCK_USERS[0],
    lastMessage: 'Привет! Я посмотрел твой профиль, давай обсудим архитектуру?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 1,
  },
  {
    id: 'c2',
    partner: MOCK_USERS[4],
    lastMessage: 'Отличная идея с cybersecurity AI, у меня есть контакты в SOC2 аудите',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
  },
  {
    id: 'c3',
    partner: MOCK_USERS[3],
    lastMessage: 'Готов обсудить инвестиции на pre-seed раунде',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 0,
  },
  {
    id: 'c4',
    partner: MOCK_USERS[12], // Кристина
    lastMessage: 'Обновила бэклог и расставила приоритеты на следующий спринт.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
  },
];

export function calculateCompatibility(user: OceanProfile, match: OceanProfile): number {
  // Complementarity formula: for some traits we want similarity, for others complementarity
  // For MVP: simple inverse distance normalized
  const weights = { openness: 1, conscientiousness: 1, extraversion: 1.2, agreeableness: 1, neuroticism: 0.8 };
  const traits: (keyof OceanProfile)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  
  let total = 0;
  let maxTotal = 0;
  
  traits.forEach((trait) => {
    const diff = Math.abs(user[trait] - match[trait]);
    const weight = weights[trait];
    // For extraversion and neuroticism, complementarity is better (moderate difference)
    // For others, moderate similarity is good but not identical
    let score: number;
    if (trait === 'extraversion' || trait === 'neuroticism') {
      // Optimal difference is around 20-30 points
      score = 100 - Math.abs(diff - 25) * 2;
    } else {
      score = 100 - diff;
    }
    score = Math.max(0, Math.min(100, score));
    total += score * weight;
    maxTotal += 100 * weight;
  });
  
  return Math.round((total / maxTotal) * 100);
}
