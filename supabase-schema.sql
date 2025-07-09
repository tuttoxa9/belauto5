-- Создание таблиц для проекта Autobel

-- Таблица автомобилей
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
  image_urls text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  specifications jsonb DEFAULT '{}',
  features text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Таблица настроек
CREATE TABLE settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Таблица лидов (заявки клиентов)
CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text,
  car_id uuid REFERENCES cars(id),
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Таблица отзывов
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Таблица историй/новостей
CREATE TABLE stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_is_available ON cars(is_available);
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_reviews_is_published ON reviews(is_published);
CREATE INDEX idx_stories_is_published ON stories(is_published);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создание триггеров для автоматического обновления updated_at
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Настройка Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения
CREATE POLICY "Public read access for cars" ON cars
    FOR SELECT USING (true);

CREATE POLICY "Public read access for published reviews" ON reviews
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for published stories" ON stories
    FOR SELECT USING (is_published = true);

-- Политики для авторизованных пользователей (админы)
CREATE POLICY "Admin full access to cars" ON cars
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to settings" ON settings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to leads" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to reviews" ON reviews
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to stories" ON stories
    FOR ALL USING (auth.role() = 'authenticated');

-- Политика для создания лидов (заявки от клиентов)
CREATE POLICY "Anyone can create leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Создание storage bucket для изображений
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Политики для storage
CREATE POLICY "Public read access to images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Admin upload access to images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete access to images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Вставка начальных настроек
INSERT INTO settings (key, value) VALUES
  ('site_title', '"AutoBel - Автомобили из Европы"'),
  ('site_description', '"Продажа качественных автомобилей из Европы. Большой выбор, выгодные цены, гарантия качества."'),
  ('contact_phone', '"+375 (29) 123-45-67"'),
  ('contact_email', '"info@autobel.by"'),
  ('contact_address', '"г. Минск, ул. Примерная, 123"'),
  ('working_hours', '"Пн-Пт: 9:00-19:00, Сб: 10:00-17:00, Вс: выходной"'),
  ('telegram_bot_token', '""'),
  ('telegram_chat_id', '""');
