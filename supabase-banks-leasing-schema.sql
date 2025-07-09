-- Создание таблицы банков
CREATE TABLE IF NOT EXISTS banks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    min_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    max_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    min_amount INTEGER NOT NULL DEFAULT 0,
    max_amount INTEGER NOT NULL DEFAULT 0,
    min_term_months INTEGER NOT NULL DEFAULT 0,
    max_term_months INTEGER NOT NULL DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы лизинговых компаний
CREATE TABLE IF NOT EXISTS leasing_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    min_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    max_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    min_advance_percent INTEGER NOT NULL DEFAULT 0,
    max_advance_percent INTEGER NOT NULL DEFAULT 0,
    min_term_months INTEGER NOT NULL DEFAULT 0,
    max_term_months INTEGER NOT NULL DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_banks_active ON banks(is_active);
CREATE INDEX IF NOT EXISTS idx_banks_order ON banks(order_index);
CREATE INDEX IF NOT EXISTS idx_leasing_companies_active ON leasing_companies(is_active);
CREATE INDEX IF NOT EXISTS idx_leasing_companies_order ON leasing_companies(order_index);

-- Добавление тестовых данных для банков
INSERT INTO banks (name, description, min_rate, max_rate, min_amount, max_amount, min_term_months, max_term_months, features, requirements, is_active, order_index) VALUES
('Беларусбанк', 'Крупнейший банк Беларуси с выгодными условиями автокредитования', 12.0, 18.0, 3000, 100000, 12, 84, ARRAY['Низкие процентные ставки', 'Быстрое рассмотрение заявки', 'Возможность досрочного погашения'], ARRAY['Возраст от 21 до 65 лет', 'Стаж работы от 6 месяцев', 'Справка о доходах'], true, 1),
('Альфа-Банк', 'Современный банк с инновационными решениями', 13.0, 19.0, 5000, 80000, 12, 72, ARRAY['Онлайн-подача заявки', 'Гибкие условия', 'Персональный менеджер'], ARRAY['Возраст от 23 до 60 лет', 'Стабильный доход', 'Поручители'], true, 2),
('БПС-Сбербанк', 'Надежный банк с выгодными предложениями', 14.0, 20.0, 4000, 75000, 6, 60, ARRAY['Специальные программы', 'Льготные условия', 'Страхование включено'], ARRAY['Постоянная регистрация', 'Подтверждение доходов', 'Первоначальный взнос'], true, 3);

-- Добавление тестовых данных для лизинговых компаний
INSERT INTO leasing_companies (name, description, min_rate, max_rate, min_advance_percent, max_advance_percent, min_term_months, max_term_months, features, requirements, is_active, order_index) VALUES
('БелВЭБ-Лизинг', 'Ведущая лизинговая компания Беларуси', 8.0, 15.0, 10, 50, 12, 60, ARRAY['Налоговые льготы', 'Гибкий график платежей', 'Возможность выкупа'], ARRAY['Юридическое лицо', 'Положительная кредитная история', 'Финансовая отчетность'], true, 1),
('Райффайзен-Лизинг', 'Европейские стандарты лизинга в Беларуси', 9.0, 16.0, 15, 40, 12, 48, ARRAY['Быстрое оформление', 'Индивидуальный подход', 'Полное сопровождение'], ARRAY['Регистрация в РБ', 'Положительная репутация', 'Страхование предмета лизинга'], true, 2),
('БПС-Лизинг', 'Профессиональные лизинговые решения', 10.0, 17.0, 20, 60, 6, 36, ARRAY['Специальные программы', 'Техническое обслуживание', 'Гарантийное обслуживание'], ARRAY['Опыт работы в отрасли', 'Собственные средства', 'Техническая экспертиза'], true, 3);

-- Создание политик безопасности (Row Level Security)
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leasing_companies ENABLE ROW LEVEL SECURITY;

-- Политики для чтения (все могут читать активные записи)
CREATE POLICY "Allow public read active banks" ON banks FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read active leasing companies" ON leasing_companies FOR SELECT USING (is_active = true);

-- Политики для админов (все операции - позже нужно будет настроить аутентификацию)
CREATE POLICY "Allow admin all operations on banks" ON banks FOR ALL USING (true);
CREATE POLICY "Allow admin all operations on leasing companies" ON leasing_companies FOR ALL USING (true);
