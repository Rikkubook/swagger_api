const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET ;

exports.register = async (req, res) => {
  const errors = validationResult(req); // 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, checkPassword } = req.body;
  if (password !== checkPassword){
    return res.status(400).json({ error: '帳號密碼不合' });
  }

  try {
    // 1. 檢查 email 是否已存在 --- 可以再嚴格驗證
    const { data: existUser, error: existError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email);

    if (existError) throw new Error(existError.message);
    if (existUser.length > 0) {
      return res.status(409).json({ error: '此帳號已註冊' });
    }

    // 2. 密碼加鹽加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. 新增用戶
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .select(); // 回傳新資料（Supabase 預設不回傳）

    if (error) throw new Error(error.message);

    // 4. 回傳成功訊息
    res.status(201).json({
      message: '註冊成功',
      user: { email: data[0].email},
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // 1. 查找使用者
    const { data: userData, error } = await supabase
      .from('users')
      .select('*') // 取得的欄位
      .eq('email', email) // 條件
      .single();

    if (error || !userData) return res.status(401).json({ error: 'User not found' });

    // 2. 比對密碼
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return res.status(401).json({ error: 'Wrong password' });

    // 3. 產生 JWT token
    const token = jwt.sign(
      { userId: userData.user_id, email: userData.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. 寫入 Cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    });

    // 5. 回應
    res.status(200).json({ message: 'Login success', token, user: { id: userData.id, email: userData.email } });

  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};