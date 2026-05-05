-- Supabase (PostgreSQL) Migration Script
-- Copy and paste this into the Supabase SQL Editor

-- 1. Drop existing tables if they exist
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. Create Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);

-- 3. Create Questions Table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  level INTEGER,
  game_type TEXT NOT NULL, -- 'obrolan', 'truth', 'dare'
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Categories
INSERT INTO categories (id, name, color) VALUES 
(1, 'Asmara', 'pink'),
(2, 'Perasaan', 'orange'),
(3, 'Deep Talk', 'green'),
(4, 'Psikologi', 'purple');

-- 5. Seed Questions
-- Obrolan
INSERT INTO questions (question_text, category_id, level, game_type) VALUES 
('Apa satu hal yang paling kamu takuti dalam hubungan, dan mengapa?', 1, 1, 'obrolan'),
('Kapan terakhir kali kamu merasa sangat dicintai oleh seseorang?', 1, 2, 'obrolan'),
('Ceritakan hal terbodoh yang pernah kamu lakukan demi cinta.', 1, 3, 'obrolan'),
('Emosi apa yang paling susah kamu ungkapkan ke orang lain?', 2, 1, 'obrolan'),
('Kapan terakhir kamu merasa benar-benar bahagia tanpa alasan yang jelas?', 2, 2, 'obrolan'),
('Apa penyesalan terbesarmu yang membentuk dirimu sekarang?', 3, 3, 'obrolan'),
('Pernah merasa kehilangan jati diri? Kapan dan bagaimana kamu menemukannya lagi?', 3, 3, 'obrolan');

-- Truth or Dare
INSERT INTO questions (question_text, category_id, level, game_type) VALUES 
('Siapa orang terakhir yang kamu stalking di Instagram?', NULL, NULL, 'truth'),
('Kapan terakhir kali kamu menangis dan apa alasannya?', NULL, NULL, 'truth'),
('Telepon mantan sekarang juga dan bilang kangen.', NULL, NULL, 'dare'),
('Post foto selfie terjelekmu di story sekarang dan biarkan 1 jam.', NULL, NULL, 'dare');

-- 6. Adjust Sequences (so next ID starts correctly)
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));
