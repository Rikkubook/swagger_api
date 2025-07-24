const jwt = require('jsonwebtoken');

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.login = (req, res) => {
  const { username, password } = req.body;
  // 這裡僅示範，實際應查詢資料庫
  if (username === 'test' && password === '1234') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    return res.json({ message: 'Login success', token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

  // 檢查是否已存在
  const { data: existUser, error: existError } = await supabase
    .from('users')
    .select('username')
    .eq('username', username);
  if (existError) return res.status(500).json({ error: existError.message });
  if (existUser && existUser.length > 0) return res.status(409).json({ error: 'Username already exists' });

  // 新增用戶
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password }]); // 實際應加密密碼
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Register success', user: data[0] });
};
