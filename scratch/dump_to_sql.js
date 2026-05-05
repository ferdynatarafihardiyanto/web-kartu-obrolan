import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('game.db');

function dumpToSql() {
  let sql = '-- Supabase (PostgreSQL) Migration Script\n\n';

  // Categories Table
  sql += 'DROP TABLE IF EXISTS questions CASCADE;\n';
  sql += 'DROP TABLE IF EXISTS categories CASCADE;\n\n';
  
  sql += `CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);\n\n`;

  // Questions Table
  sql += `CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  level INTEGER,
  game_type TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);\n\n`;

  // Insert Categories
  const categories = db.prepare('SELECT * FROM categories').all();
  if (categories.length > 0) {
    sql += '-- Seed Categories\n';
    categories.forEach(cat => {
      sql += `INSERT INTO categories (id, name, color) VALUES (${cat.id}, '${cat.name.replace(/'/g, "''")}', '${cat.color}');\n`;
    });
    sql += `SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));\n\n`;
  }

  // Insert Questions
  const questions = db.prepare('SELECT * FROM questions').all();
  if (questions.length > 0) {
    sql += '-- Seed Questions\n';
    questions.forEach(q => {
      const isUsed = q.is_used ? 'TRUE' : 'FALSE';
      const categoryId = q.category_id === null ? 'NULL' : q.category_id;
      const level = q.level === null ? 'NULL' : q.level;
      sql += `INSERT INTO questions (id, question_text, category_id, level, game_type, is_used, created_at) VALUES (${q.id}, '${q.question_text.replace(/'/g, "''")}', ${categoryId}, ${level}, '${q.game_type}', ${isUsed}, '${q.created_at}');\n`;
    });
    sql += `SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));\n\n`;
  }

  fs.writeFileSync('supabase_migration.sql', sql);
  console.log('Migration script generated: supabase_migration.sql');
}

dumpToSql();
db.close();
