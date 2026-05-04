import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'game.db'), { verbose: console.log });

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_text TEXT NOT NULL,
    category_id INTEGER,
    level INTEGER,
    game_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );
`);

// Seed Initial Data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
if (count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  const catAsmara = insertCategory.run('Asmara', 'pink');
  const catPerasaan = insertCategory.run('Perasaan', 'orange');
  const catDeep = insertCategory.run('Deep Talk', 'green');
  const catPsikologi = insertCategory.run('Psikologi', 'purple');

  const insertQuestion = db.prepare('INSERT INTO questions (question_text, category_id, level, game_type) VALUES (?, ?, ?, ?)');
  
  // Obrolan Questions
  insertQuestion.run('Apa satu hal yang paling kamu takuti dalam hubungan, dan mengapa?', catAsmara.lastInsertRowid, 1, 'obrolan');
  insertQuestion.run('Kapan terakhir kali kamu merasa sangat dicintai oleh seseorang?', catAsmara.lastInsertRowid, 2, 'obrolan');
  insertQuestion.run('Ceritakan hal terbodoh yang pernah kamu lakukan demi cinta.', catAsmara.lastInsertRowid, 3, 'obrolan');
  
  insertQuestion.run('Emosi apa yang paling susah kamu ungkapkan ke orang lain?', catPerasaan.lastInsertRowid, 1, 'obrolan');
  insertQuestion.run('Kapan terakhir kamu merasa benar-benar bahagia tanpa alasan yang jelas?', catPerasaan.lastInsertRowid, 2, 'obrolan');
  
  insertQuestion.run('Apa penyesalan terbesarmu yang membentuk dirimu sekarang?', catDeep.lastInsertRowid, 3, 'obrolan');
  insertQuestion.run('Pernah merasa kehilangan jati diri? Kapan dan bagaimana kamu menemukannya lagi?', catDeep.lastInsertRowid, 3, 'obrolan');

  // Truth or Dare
  insertQuestion.run('Siapa orang terakhir yang kamu stalking di Instagram?', null, null, 'truth');
  insertQuestion.run('Kapan terakhir kali kamu menangis dan apa alasannya?', null, null, 'truth');
  
  insertQuestion.run('Telepon mantan sekarang juga dan bilang kangen.', null, null, 'dare');
  insertQuestion.run('Post foto selfie terjelekmu di story sekarang dan biarkan 1 jam.', null, null, 'dare');
}

export default db;
