-- Создание таблицы полей для AgroChain
CREATE TABLE fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'planted',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    plant_date DATE,
    harvest_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы событий/операций
CREATE TABLE field_events (
    id SERIAL PRIMARY KEY,
    field_id INTEGER REFERENCES fields(id),
    action VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление тестовых данных
INSERT INTO fields (name, area, crop, status, progress, plant_date, harvest_date) VALUES
('Поле "Северное"', 25.3, 'Пшеница', 'growing', 75, '2024-05-15', '2024-09-20'),
('Поле "Восточное"', 18.7, 'Картофель', 'harvest-ready', 95, '2024-04-20', '2024-08-15'),
('Поле "Южное"', 32.1, 'Кукуруза', 'planted', 45, '2024-06-01', '2024-10-15');

INSERT INTO field_events (field_id, action, event_date, status) VALUES
(1, 'Обработка от вредителей', '2024-10-02', 'planned'),
(2, 'Сбор урожая', '2024-10-05', 'planned'),
(3, 'Внесение удобрений', '2024-10-10', 'planned');