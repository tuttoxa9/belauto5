# План миграции проекта Autobel с Firebase на Supabase

## Цель
Полная замена Firebase на Supabase в качестве backend решения, сохранив при этом весь внешний вид и функционал сайта.

## Анализ текущей архитектуры

### Firebase компоненты которые нужно заменить:
1. **Firebase Authentication** - авторизация админки
2. **Firestore Database** - база данных для автомобилей, настроек, отзывов, лидов
3. **Firebase Storage** - хранение изображений
4. **Firebase Analytics** - аналитика (опционально)

### Основные коллекции Firestore:
- `cars` - автомобили в каталоге
- `settings` - настройки сайта
- `stories` - истории/новости
- `leads` - заявки клиентов
- `reviews` - отзывы
- `about` - информация о компании
- `contacts` - контактная информация
- `credit` - условия кредита
- `leasing` - условия лизинга
- `privacy` - политика конфиденциальности

## Этапы миграции

### Этап 1: Настройка Supabase
- [ ] Создание проекта в Supabase
- [ ] Настройка таблиц в PostgreSQL
- [ ] Настройка Row Level Security (RLS)
- [ ] Настройка Storage для изображений

### Этап 2: Замена Firebase Auth на Supabase Auth
- [ ] Установка @supabase/supabase-js
- [ ] Создание lib/supabase.ts
- [ ] Обновление страницы админки (app/adminbel/page.tsx)
- [ ] Настройка аутентификации

### Этап 3: Замена Firestore на Supabase PostgreSQL
- [ ] Обновление всех admin компонентов:
  - components/admin/admin-cars.tsx
  - components/admin/admin-settings.tsx
  - components/admin/admin-stories.tsx
  - components/admin/admin-leads.tsx
  - components/admin/admin-about.tsx
  - components/admin/admin-credit.tsx
  - components/admin/admin-contacts.tsx
  - components/admin/admin-reviews.tsx
  - components/admin/admin-privacy.tsx
  - components/admin/admin-leasing.tsx

### Этап 4: Замена Firebase Storage на Supabase Storage
- [ ] Обновление компонента загрузки изображений (components/admin/image-upload.tsx)
- [ ] Обновление компонентов отображения изображений

### Этап 5: Замена API routes
- [ ] Обновление app/api/firestore/route.ts
- [ ] Обновление других API маршрутов при необходимости

### Этап 6: Обновление фронтенд компонентов
- [ ] Обновление компонентов каталога (app/catalog/page.tsx, app/catalog/[id]/page.tsx)
- [ ] Обновление основных страниц, использующих данные
- [ ] Обновление провайдеров если необходимо

### Этап 7: Очистка и тестирование
- [ ] Удаление Firebase зависимостей
- [ ] Удаление неиспользуемых файлов
- [ ] Полное тестирование функционала

## Файлы которые НужНО изменить:

### Конфигурация и зависимости:
- `package.json` - замена firebase на @supabase/supabase-js
- `lib/firebase.js` → `lib/supabase.ts`

### Страницы приложения:
- `app/adminbel/page.tsx` - страница админки
- `app/catalog/page.tsx` - каталог автомобилей
- `app/catalog/[id]/page.tsx` - детальная страница автомобиля
- `app/about/page.tsx` - страница о компании
- `app/contacts/page.tsx` - контакты
- `app/credit/page.tsx` - кредитование
- `app/leasing/page.tsx` - лизинг
- `app/reviews/page.tsx` - отзывы
- `app/privacy/page.tsx` - политика конфиденциальности

### API маршруты:
- `app/api/firestore/route.ts` → переименовать и обновить для Supabase

### Компоненты админки:
- `components/admin/admin-cars.tsx`
- `components/admin/admin-settings.tsx`
- `components/admin/admin-stories.tsx`
- `components/admin/admin-leads.tsx`
- `components/admin/admin-about.tsx`
- `components/admin/admin-credit.tsx`
- `components/admin/admin-contacts.tsx`
- `components/admin/admin-reviews.tsx`
- `components/admin/admin-privacy.tsx`
- `components/admin/admin-leasing.tsx`
- `components/admin/image-upload.tsx`

### Основные компоненты:
- `components/car-card.tsx`
- `components/stories.tsx`
- `components/credit-conditions.tsx`
- `components/leasing-conditions.tsx`

### Утилиты:
- `lib/cache-invalidation.ts` - обновить под Supabase
- `lib/storage.ts` - заменить на Supabase Storage

## Структура таблиц Supabase

### Таблица `cars`
```sql
CREATE TABLE cars (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage integer,
  engine_volume text,
  fuel_type text,
  transmission text,
  drive_train text,
  body_type text,
  color text,
  description text,
  image_urls text[],
  is_available boolean DEFAULT true,
  specifications jsonb,
  features text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Таблица `settings`
```sql
CREATE TABLE settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Остальные таблицы аналогично...

## Важные заметки:
- ❗ НЕ МЕНЯТЬ внешний вид сайта
- ❗ Сохранить все существующие функции
- ❗ Обеспечить обратную совместимость данных
- ❗ Тщательно тестировать каждый этап
