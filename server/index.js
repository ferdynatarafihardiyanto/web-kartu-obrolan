import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Migration: add is_used column if not exists
try {
  db.exec("ALTER TABLE questions ADD COLUMN is_used INTEGER DEFAULT 0");
  console.log("Migration: added is_used column");
} catch (e) {
  // Column already exists, skip
}

// ── Categories ─────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM categories').all());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Random question for Kartu Obrolan (skip used) ─────
app.get('/api/questions/random', (req, res) => {
  const { category, level, type } = req.query;
  try {
    let query = `SELECT q.*, c.name as category_name, c.color
                 FROM questions q JOIN categories c ON q.category_id = c.id
                 WHERE q.game_type = ? AND q.is_used = 0`;
    const params = [type || 'obrolan'];
    if (category) { query += ' AND c.name = ?'; params.push(category); }
    if (level)    { query += ' AND q.level = ?'; params.push(level); }
    query += ' ORDER BY RANDOM() LIMIT 1';
    res.json(db.prepare(query).get(...params) || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Random Truth or Dare (skip used) ──────────────────
app.get('/api/truth-or-dare/random', (req, res) => {
  const { type } = req.query;
  try {
    const q = db.prepare('SELECT * FROM questions WHERE game_type = ? AND is_used = 0 ORDER BY RANDOM() LIMIT 1').get(type);
    res.json(q || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Mark question as used (kirim ke sampah) ───────────
app.post('/api/questions/:id/use', (req, res) => {
  try {
    db.prepare('UPDATE questions SET is_used = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Restore one question from trash ───────────────────
app.post('/api/questions/:id/restore', (req, res) => {
  try {
    db.prepare('UPDATE questions SET is_used = 0 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Restore ALL questions from trash ──────────────────
app.post('/api/questions/restore-all', (req, res) => {
  try {
    db.prepare('UPDATE questions SET is_used = 0 WHERE is_used = 1').run();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: stats ──────────────────────────────────────
app.get('/api/admin/stats', (req, res) => {
  try {
    const total    = db.prepare('SELECT COUNT(*) as c FROM questions WHERE is_used = 0').get().c;
    const cats     = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
    const used     = db.prepare('SELECT COUNT(*) as c FROM questions WHERE is_used = 1').get().c;
    res.json({ totalQuestions: total, totalCategories: cats, usedQuestions: used });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: list questions (active or trash) ───────────
app.get('/api/questions', (req, res) => {
  const { search, category, game_type, is_used } = req.query;
  try {
    let query = `SELECT q.*, c.name as category_name, c.color as category_color
                 FROM questions q LEFT JOIN categories c ON q.category_id = c.id WHERE 1=1`;
    const params = [];

    query += (is_used === 'true' || is_used === '1') ? ' AND q.is_used = 1' : ' AND q.is_used = 0';

    if (search)    { query += ' AND q.question_text LIKE ?'; params.push(`%${search}%`); }
    if (category)  { query += ' AND q.category_id = ?';     params.push(category); }
    if (game_type) { query += ' AND q.game_type = ?';       params.push(game_type); }

    query += ' ORDER BY q.created_at DESC';
    res.json(db.prepare(query).all(...params));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: add question ───────────────────────────────
app.post('/api/questions', (req, res) => {
  const { question_text, category_id, level, game_type } = req.body;
  try {
    const r = db.prepare('INSERT INTO questions (question_text, category_id, level, game_type) VALUES (?, ?, ?, ?)').run(question_text, category_id || null, level || null, game_type);
    res.json({ id: r.lastInsertRowid, success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: update question ────────────────────────────
app.put('/api/questions/:id', (req, res) => {
  const { question_text, category_id, level, game_type } = req.body;
  try {
    db.prepare('UPDATE questions SET question_text = ?, category_id = ?, level = ?, game_type = ? WHERE id = ?').run(question_text, category_id || null, level || null, game_type, req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: delete question ────────────────────────────
app.delete('/api/questions/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
