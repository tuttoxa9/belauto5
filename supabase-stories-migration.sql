-- Миграция таблицы stories для поддержки нового формата
-- Удаляем старую таблицу stories и создаем новую

DROP TABLE IF EXISTS stories CASCADE;

-- Создаем новую таблицу stories для историй/новостей
CREATE TABLE stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  caption text NOT NULL,
  subtitle text,
  link_url text,
  order_index integer NOT NULL DEFAULT 1,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Создаем индексы
CREATE INDEX idx_stories_order_index ON stories(order_index);
CREATE INDEX idx_stories_is_published ON stories(is_published);

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Настройка Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Обновленные политики для stories - разрешаем публичное чтение и анонимные операции
CREATE POLICY "Public read access for published stories" ON stories
    FOR SELECT USING (is_published = true);

-- Разрешаем анонимным пользователям все операции со stories (для админки)
CREATE POLICY "Anonymous full access to stories" ON stories
    FOR ALL USING (true);

-- Обновляем политики для settings - разрешаем анонимные операции
DROP POLICY IF EXISTS "Admin full access to settings" ON settings;

CREATE POLICY "Public read access to settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Anonymous full access to settings" ON settings
    FOR ALL USING (true);

-- Также обновляем политики для других таблиц, чтобы разрешить анонимные операции админки
DROP POLICY IF EXISTS "Admin full access to pages" ON pages;

CREATE POLICY "Public read access to pages" ON pages
    FOR SELECT USING (true);

CREATE POLICY "Anonymous full access to pages" ON pages
    FOR ALL USING (true);
