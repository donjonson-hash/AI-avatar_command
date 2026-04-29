# Syndi AI — Design PRD

## Общая информация
- **Название проекта**: Syndi AI
- **Тип приложения**: AI-native co-founder matching platform (SPA, многостраничное React-приложение)
- **Целевая аудитория**: Технические предприниматели, инди-хакеры, студенты стартап-школ, инвесторы
- **Язык интерфейса**: Русский (primary), English (secondary labels)
- **Платформа**: Desktop + Mobile Web (responsive)
- **Режим масштабирования**: 100% default desktop, responsive breakpoints for tablet/mobile

## Цель дизайна
Создать визуально уникальную, футуристичную платформу, которая через дизайн коммуницирует идею «AI-нативности» и «психологической совместимости». Тёмная тема, неоновые акценты, ощущение научного инструмента для подбора идеальных команд. Дизайн должен вызывать доверие через технологичность и точность, но при этом оставаться эмоциональным — мы работаем с людьми и их характерами.

## Дизайн-система

### Типографика
- **Primary Font**: `Inter` (Google Fonts) — 300, 400, 500, 600, 700
- **Display / Headings**: `Space Grotesk` — 500, 700 (все заголовки H1-H3 и логотип)
- **Fallback stack**: `'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **H1**: 48px / 56px line-height, weight 700, letter-spacing -0.02em
- **H2**: 32px / 40px line-height, weight 700, letter-spacing -0.01em
- **H3**: 24px / 32px line-height, weight 600
- **Body**: 16px / 24px line-height, weight 400
- **Small / Caption**: 14px / 20px line-height, weight 400
- **Label / Tag**: 12px / 16px line-height, weight 500, uppercase, letter-spacing 0.05em

### Цветовая палитра
- **Background Primary**: `#0a0e17` — глубокий космический синий
- **Background Secondary**: `#111827` — слегка приподнятый тёмный
- **Background Card / Elevated**: `#1f2937` — поверхности карточек
- **Surface Overlay**: `rgba(10, 14, 23, 0.85)` — для модалов и оверлеев
- **Primary Accent**: `#00d4aa` — бирюзовый неон (основной бренд)
- **Secondary Accent**: `#c77dff` — фиолетовый неон (аватар, AI)
- **Matching Accent**: `#ff6b9d` — розовый неон (матчинг, любовь, совместимость)
- **Warning / Attention**: `#ff9f1c` — оранжевый (алерты, CTA вторичные)
- **Error**: `#e63946` — красный (security alerts, блокировки)
- **Text Primary**: `#f9fafb` — почти белый
- **Text Secondary**: `#9ca3af` — серый для второстепенного
- **Text Muted**: `#6b7280` — приглушённый
- **Border / Divider**: `#374151` — тонкие границы

### Spacing & Shape
- **Border radius**: 12px (карточки), 8px (кнопки маленькие), 9999px (pill-shaped для tags/chips)
- **Page padding**: 24px mobile, 48px desktop
- **Max content width**: 1280px
- **Card padding**: 24px
- **Section vertical gap**: 64px desktop, 40px mobile
- **Grid**: 12-колоночная система, gap 24px

### Компоненты
- **Buttons**:
  - Primary: bg `#00d4aa`, text `#0a0e17`, radius 8px, padding 12px 24px, hover: brightness(1.1), transition 200ms
  - Secondary: bg transparent, border 1px solid `#374151`, text `#f9fafb`, hover: border `#00d4aa`, text `#00d4aa`
  - Ghost: bg transparent, text `#9ca3af`, hover: text `#f9fafb`
  - CTA Large: bg gradient from `#00d4aa` to `#2ec4b6`, text white, shadow `0 0 20px rgba(0,212,170,0.3)`
- **Cards**: bg `#1f2937`, border 1px solid `#374151`, radius 12px, padding 24px, hover: border `#00d4aa` (subtle), transition 300ms, shadow none by default, on hover: `0 4px 24px rgba(0,212,170,0.08)`
- **Inputs**: bg `#111827`, border 1px solid `#374151`, radius 8px, text `#f9fafb`, focus: border `#00d4aa` + shadow `0 0 0 3px rgba(0,212,170,0.15)`, padding 12px 16px
- **Avatar / Profile images**: круглые, 40px/64px/128px, border 2px solid `#00d4aa` для «подсвеченных», grayscale filter для неактивных
- **Badges / Chips**: pill-shaped, маленькие, с цветными бордерами
  - Например: «Founder» border `#00d4aa` bg `rgba(0,212,170,0.1)` text `#00d4aa`
  - «Investor» border `#ff9f1c` bg `rgba(255,159,28,0.1)` text `#ff9f1c`
- **Progress bars**: тонкие (4px), bg `#374151`, fill gradient `#00d4aa` → `#2ec4b6`
- **Radar chart (OCEAN)**: оси `#374151`, заливка с прозрачностью 0.25, линия 2px цвет агента

## Технологический стек
- React 19 + TypeScript
- Vite (build)
- Tailwind CSS 3.4
- shadcn/ui components (Button, Card, Input, Badge, Progress, Dialog, Tabs)
- react-router-dom (многостраничный SPA)
- framer-motion (page transitions, swipe gestures, animations)
- lucide-react (иконки)

## Страницы приложения

### Страница 1: Landing Page (/) — «Syndi AI Home»
**Назначение**: Привлечь внимание, объяснить концепцию, привести к регистрации.
**Hero-секция**:
- Полноэкранный hero, bg — космический градиент (asset: `hero-bg.jpg`)
- Анимированные частицы / звёзды (CSS-only, не canvas)
- H1: «Найди сооснователя, который дополняет тебя»
- Subtitle: «AI-платформа для подбора идеальных стартап-команд. Психометрическая совместимость + живые цифровые аватары.»
- CTA: «Начать подбор» (Primary Large) + «Узнать больше» (Secondary)
- Floating element: круглые аватарки потенциальных co-founders, медленно дрейфующие с CSS-анимацией (parallax-lite)

**Features-секция**:
- 3 карточки в ряд (grid)
  1. «Психометрический анализ OCEAN» — иконка brain, описание
  2. «Живой AI-аватар» — иконка sparkles, описание
  3. «Алгоритм дополнения» — иконка users, описание

**How It Works**:
- 4 шага по горизонтали (линия-соединитель между ними)
  1. Создай профиль + пройди тест
  2. AI создаёт твой цифровой двойник
  3. Алгоритм находит идеальную пару
  4. Общайся через аватаров или вживую

**Social Proof**:
- Логотипы акселераторов / сообществ (YC, Techstars placeholder)
- Статистика: «247 команды уже нашли друг друга»

**Footer**:
- Минималистичный, цвета фона, логотип, ссылки

**Анимации на странице**:
- Hero text reveal: staggered fade-up (y: 30 → 0, opacity 0 → 1), delay 0.1s между элементами, duration 0.8s, ease `easeOut`
- Floating avatars: CSS `animation: float 6s ease-in-out infinite` с разными delays
- Feature cards: fade-in on scroll (IntersectionObserver + Framer motion `whileInView`)
- Step connector line: SVG stroke-dashoffset animation при скролле в view

---

### Страница 2: Onboarding — OCEAN Questionnaire (/onboarding)
**Назначение**: Собрать психометрический профиль пользователя через 15 адаптивных вопросов (сокращённая версия для MVP, не 30).
**UI**:
- Прогресс-бар вверху (15 шагов)
- Вопрос по центру экрана, крупный текст
- Варианты ответа: 5 radio-кнопок в ряд с emoji-шкалой (от «Полностью не согласен» до «Полностью согласен»)
- Кнопки «Назад» / «Далее»
- Минималистичный, без sidebar, фокус на вопросе

**OCEAN Traits measured** (по 3 вопроса на trait):
- Openness (O): «Мне нравится пробовать новые технологии» / «Я предпочитаю проверенные решения» (inverse)
- Conscientiousness (C): «Я всегда планирую свои задачи заранее» / «Дедлайны мотивируют меня»
- Extraversion (E): «Я заряжаюсь энергией от общения с людьми» / «Я предпочитаю работать в одиночку» (inverse)
- Agreeableness (A): «Я стремлюсь к консенсусу в команде» / «Я отстаиваю свою точку зрения даже под давлением» (inverse)
- Neuroticism (N): «Я легко переживаю перед важными встречами» / «Я спокоен в кризисных ситуациях» (inverse)

**Анимации**:
- Переход между вопросами: slide-out-left + slide-in-right (Framer motion `AnimatePresence`), duration 0.4s
- Прогресс-бар: smooth width transition 0.3s
- При завершении: fade-out вопроса, fade-in «Анализируем ваш профиль...» с пульсирующим AI-аватаром (CSS pulse), затем redirect на /avatar

---

### Страница 3: Avatar Studio (/avatar)
**Назначение**: Создать цифровой аватар пользователя.
**UI**:
- Левая панель: зона загрузки фото (drag & drop area), голографический border (`border-image: linear-gradient(...)`), иконка upload
- Центр: preview зона аватара (круг, 256px), placeholder — силуэт с глитч-эффектом
- Правая панель: параметры кастомизации
  - Ползунки: «Реалистичность — Стилизация» (slider)
  - Тоггл: «Включить голосовой клон»
  - Кнопка «Сгенерировать» (Primary, large)
- После генерации: preview с анимацией «оживления» (медленное пульсирование градиента вокруг аватара)
- CTA внизу: «Перейти к матчам» → redirect /dashboard

**Состояния**:
- Empty state: силуэт + текст «Загрузите фото, чтобы создать вашего цифрового двойника»
- Loading state: скелетон (pulsing gradient) + текст «AI анализирует черты лица...»
- Generated state: готовый аватар + кнопка «Пересоздать»

**Анимации**:
- Border градиент: CSS `animation: rotate 3s linear infinite` для holographic effect
- Upload hover: scale(1.02), border glow `#00d4aa`
- Avatar reveal: scale 0.8 → 1.0 + opacity 0 → 1, duration 0.6s, ease `backOut`

---

### Страница 4: Dashboard — Matching (/dashboard)
**Назначение**: Основной интерфейс для просмотра и взаимодействия с потенциальными co-founders.
**Layout**:
- Sidebar слева (200px fixed): навигация — «Матчи», «Сообщения», «Профиль», настройки
- Основная зона: карточки матчей в сетке (grid 3 колонки desktop, 2 tablet, 1 mobile)
- Top bar: поиск, фильтры (роль, навыки, локация), уведомления

**Match Card**:
- Карточка вертикальная, bg `#1f2937`, border 1px `#374151`
- Верх: аватар (128px circle), вверху справа «% совместимости» badge (цвет зависит от %: 90+ `#00d4aa`, 70-89 `#ff9f1c`, <70 `#9ca3af`)
- Имя + роль badge (Founder / Developer / Designer / Investor)
- Краткое описание (2 строки)
- OCEAN мини-радар (упрощённый, 5 осей, 60×60px)
- Действия: «Нравится» (heart icon) / «Пропустить» (x icon) / «Подробнее»
- Hover: border `#00d4aa`, subtle lift `translateY(-4px)` + shadow glow

**Swipe Mode Toggle** (вверху справа):
- Переключатель Grid ↔ Swipe
- Swipe mode: Tinder-like карточка по центру, swipe left/right с drag gesture (Framer motion `drag="x"`, `dragConstraints`)
- Swipe left: карточка улетает влево + fade, появляется следующая
- Swipe right: карточка улетает вправо + «Match!» анимация (overlay с confetti-like particles CSS)

**Filter Panel** (выезжающий сбоку):
- Slide-in from right, bg `#111827`, width 320px
- Фильтры: роли (checkboxes), навыки (tag input), готовность к переезду (toggle)

**Анимации**:
- Cards stagger entrance: fade-up, delay 0.05s между карточками
- Swipe: физика с resistance, spring animation при отпускании
- Match celebration: экран затемняется, по центру появляется «It's a match!» с пульсацией градиента
- Sidebar item hover: text `#00d4aa`, left border 3px `#00d4aa` slide-in

---

### Страница 5: User Profile (/profile)
**Назначение**: Просмотр и редактирование собственного профиля.
**UI**:
- Шапка профиля: баннер (asset: `profile-banner.jpg`, градиент), аватар по центру (по нижнему краю баннера, overlap 50%), имя, роль, локация
- Основная зона: две колонки
  - Левая (60%): About, Skills (tags), Experience timeline
  - Правая (40%): OCEAN Radar Chart (полноразмерный, 300×300px), AI Avatar preview, Edit buttons
- Edit mode: inline editing для текстов, drag-drop для skills reorder

**OCEAN Radar**:
- Интерактивный SVG, 5 осей
- Данные из onboarding
- При наведении на ось: tooltip с названием trait + score
- Анимация прорисовки: stroke-dashoffset от 0 до full при загрузке, duration 1.5s

**Анимации**:
- Banner parallax: при скролле баннер движется медленнее контента (CSS `background-attachment: scroll` с transform)
- Avatar hover: scale(1.05) + ring glow
- Skills tags: stagger entrance, scale 0 → 1, delay 0.03s

---

### Страница 6: Match Detail (/match/:id)
**Назначение**: Детальное изучение потенциального co-founder.
**UI**:
- Верхняя зона: аватар (большой, 160px), имя, роль, % совместимости (крупный текст), CTA «Написать» / «Запросить звонок»
- Две колонки:
  - Левая: полный OCEAN радар + текстовое описание совместимости (AI-generated): «Вы дополняете друг друга в принятии решений под давлением...»
  - Правая: About, Skills, GitHub stats (импортированные), портфолио projects
- Compatibility Breakdown: горизонтальные progress bars для каждого OCEAN trait, цвета градиентные

**Анимации**:
- Page entrance: fade-up, staggered sections (0.1s delay каждая)
- Compatibility score: count-up animation от 0 до % при загрузке, duration 1.2s
- CTA buttons: hover glow shadow

---

### Страница 7: Messages / Chat (/messages)
**Назначение**: Переписка с matched co-founders.
**UI**:
- Две панели:
  - Левая (280px): список диалогов, аватар + имя + last message preview + timestamp
  - Правая: активный чат
- Chat: сообщения bubbles, свои справа (bg `#00d4aa`, text dark), собеседника слева (bg `#1f2937`)
- Input zone внизу: text input + emoji + attach + send button
- AI Assistant toggle: «Попросить аватара подготовить реплику» — при включении появляется AI-suggested reply в полупрозрачном стиле

**Анимации**:
- New message: slide-in from bottom + fade, duration 0.3s
- Typing indicator: 3 dots bouncing (CSS keyframes)
- Message list: auto-scroll smooth
- Sidebar conversation hover: bg `#1f2937` highlight

---

## Общие элементы (навигация, футер, состояния)

### Навигация
- Desktop: горизонтальный top nav, sticky, bg `rgba(10,14,23,0.9)` + backdrop-blur, border-bottom 1px `#374151`
- Logo слева (Space Grotesk, weight 700, color `#00d4aa`, иконка DNA/sparkle)
- Links: «Главная», «Матчи», «Сообщения», «Профиль» — active link: text `#00d4aa` + подчёркивание (2px, animated width 0 → 100%)
- Справа: аватар пользователя (32px circle) + dropdown
- Mobile: hamburger menu, fullscreen overlay nav

### Анимации переходов между страницами
- Framer Motion `AnimatePresence` в корневом layout
- Вариант: fade + slight translateY (20px → 0), duration 0.3s, ease `easeInOut`
- На выход: opacity → 0, translateY -10px, duration 0.2s

### Toast / Notification
- Position: top-right
- Style: bg `#1f2937`, border-left 4px colored (success: `#00d4aa`, error: `#e63946`), shadow
- Анимация: slide-in from right + fade, auto-dismiss 4s

### Loading States
- Skeleton screens: bg `#1f2937` с animated gradient shimmer (CSS `background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)` + `animation: shimmer 1.5s infinite`)
- Page loading: центральный пульсирующий логотип Syndi AI

### Error / Empty States
- Иллюстрация + текст + CTA
- Например для «Нет матчей»: иконка search + «Пока нет подходящих сооснователей. Попробуйте расширить фильтры.» + кнопка «Сбросить фильтры»

## Глобальные CSS-анимации

```css
/* Floating elements (hero avatars) */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Gradient border rotation (avatar studio) */
@keyframes rotate-gradient {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}

/* Pulse glow (match celebration, AI thinking) */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,212,170,0.2); }
  50% { box-shadow: 0 0 40px rgba(0,212,170,0.5); }
}

/* Shimmer for skeletons */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Typing dots */
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

## Assets

### Изображения (необходимо сгенерировать)
1. `hero-bg.jpg` — абстрактный космический фон, тёмно-синий/фиолетовый градиент с тонкими светящимися линиями сетки (wireframe), нейтральный, без лиц. Соотношение 16:9.
2. `profile-banner.jpg` — абстрактный градиентный баннер для профиля, сине-фиолетово-бирюзовые волны. Соотношение 21:9.
3. `avatar-placeholder.jpg` — силуэт головы/плеч с цифровым glitch-эффектом, тёмный фон, неоновые контуры. Соотношение 1:1.
4. `how-it-step-1.jpg`, `...-2.jpg`, `...-3.jpg`, `...-4.jpg` — 4 иллюстрации для шагов How It Works, стиль flat digital art, тёмная тема, акцентные цвета бирюза/фиолетовый. Соотношение 4:3.
5. `empty-state-matches.jpg` — иллюстрация пустого поиска, персонаж смотрит в бинокль в космос. Соотношение 4:3.

### Иконки
- Lucide React: `Sparkles`, `Brain`, `Users`, `Upload`, `Heart`, `X`, `MessageCircle`, `Search`, `Filter`, `Settings`, `ChevronLeft`, `ChevronRight`, `Check`, `Zap`, `Globe`, `Code2`, `Palette`, `BarChart3`, `ArrowRight`

## Функциональность и интерактивность

### Логика приложения
- **User Flow**: Landing → Sign Up → Onboarding (OCEAN) → Avatar Studio → Dashboard → Match Detail / Messages
- **State management**: React Context для user auth + profile, local state для UI
- **Matching algorithm**: mock data с реалистичными профилями, compatibility score рассчитывается на клиенте по формуле: complementarity = 1 - |user_trait - match_trait| / max_distance, weighted по важности trait для роли
- **OCEAN scoring**: normalize 1-5 answers to 0-100 scale per trait, average 3 questions
- **Filter logic**: AND между категориями, OR внутри одной категории
- **Swipe logic**: threshold 100px drag, velocity-based, spring-back если не дотянул

### Данные (mock, для MVP)
- 12 тестовых профилей с разными ролями, OCEAN scores, навыками
- Профили включают: id, name, role, avatar, location, bio, skills[], OCEAN {}, github_projects[]

### Интерактивные элементы
- OCEAN radar chart: SVG, hover tooltip, анимированная отрисовка
- Swipe cards: drag gesture, snap, animation
- Filter panel: slide-in, checkboxes, tag input
- Chat: scroll to bottom, new message animation
- Avatar upload: drag & drop visual feedback

## Адаптивность
- Desktop (>1024px): полный layout, sidebar, 3-col grid
- Tablet (768-1024px): 2-col grid, sidebar collapsible
- Mobile (<768px): single column, bottom nav вместо sidebar, swipe mode default for matching
- Touch: swipe gestures, tap targets min 44px

## Дополнительные требования
- **Dark mode only** — no light mode toggle in MVP
- **Accessibility**: WCAG 2.1 AA — contrast ratios met (text on bg проверен), focus indicators visible, alt text for images, semantic HTML
- **Performance**: lazy load images, code split routes (React.lazy), skeleton screens
- **SEO**: meta tags, Open Graph для landing page
