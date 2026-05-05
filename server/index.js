import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── Categories ─────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  const { data, error } = await db.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Random question for Kartu Obrolan (skip used) ─────
app.get('/api/questions/random', async (req, res) => {
  const { category, level, type } = req.query;
  try {
    let query = db.from('questions')
      .select('*, categories!inner(name, color)')
      .eq('game_type', type || 'obrolan')
      .eq('is_used', false);

    if (category) query = query.eq('categories.name', category);
    if (level)    query = query.eq('level', level);

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) return res.json(null);

    // Pick random
    const randomQuestion = data[Math.floor(Math.random() * data.length)];
    
    // Flatten category info to match old response structure
    const formatted = {
      ...randomQuestion,
      category_name: randomQuestion.categories.name,
      color: randomQuestion.categories.color
    };
    
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Random Truth or Dare (skip used) ──────────────────
app.get('/api/truth-or-dare/random', async (req, res) => {
  const { type } = req.query;
  try {
    const { data, error } = await db.from('questions')
      .select('*')
      .eq('game_type', type)
      .eq('is_used', false);
    
    if (error) throw error;
    if (!data || data.length === 0) return res.json(null);

    const random = data[Math.floor(Math.random() * data.length)];
    res.json(random);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Mark question as used (kirim ke sampah) ───────────
app.post('/api/questions/:id/use', async (req, res) => {
  const { error } = await db.from('questions').update({ is_used: true }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Restore one question from trash ───────────────────
app.post('/api/questions/:id/restore', async (req, res) => {
  const { error } = await db.from('questions').update({ is_used: false }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Restore ALL questions from trash ──────────────────
app.post('/api/questions/restore-all', async (req, res) => {
  const { error } = await db.from('questions').update({ is_used: false }).eq('is_used', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Admin: stats ──────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
  try {
    const { count: total, error: e1 } = await db.from('questions').select('*', { count: 'exact', head: true }).eq('is_used', false);
    const { count: cats,  error: e2 } = await db.from('categories').select('*', { count: 'exact', head: true });
    const { count: used,  error: e3 } = await db.from('questions').select('*', { count: 'exact', head: true }).eq('is_used', true);
    
    if (e1 || e2 || e3) throw (e1 || e2 || e3);

    res.json({ totalQuestions: total, totalCategories: cats, usedQuestions: used });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: list questions (active or trash) ───────────
app.get('/api/questions', async (req, res) => {
  const { search, category, game_type, is_used } = req.query;
  try {
    let query = db.from('questions')
      .select('*, categories(name, color)')
      .order('created_at', { ascending: false });

    query = query.eq('is_used', is_used === 'true' || is_used === '1');

    if (search)    query = query.ilike('question_text', `%${search}%`);
    if (category)  query = query.eq('category_id', category);
    if (game_type) query = query.eq('game_type', game_type);

    const { data, error } = await query;
    if (error) throw error;

    // Format output to match old structure
    const formatted = data.map(q => ({
      ...q,
      category_name: q.categories?.name,
      category_color: q.categories?.color
    }));

    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin: add question ───────────────────────────────
app.post('/api/questions', async (req, res) => {
  const { question_text, category_id, level, game_type } = req.body;
  const { data, error } = await db.from('questions').insert([
    { question_text, category_id: category_id || null, level: level || null, game_type }
  ]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data[0].id, success: true });
});

// ── Admin: update question ────────────────────────────
app.put('/api/questions/:id', async (req, res) => {
  const { question_text, category_id, level, game_type } = req.body;
  const { error } = await db.from('questions').update({
    question_text, category_id: category_id || null, level: level || null, game_type
  }).eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Admin: delete question ────────────────────────────
app.delete('/api/questions/:id', async (req, res) => {
  const { error } = await db.from('questions').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with Supabase`);
  });
}

export default app;
