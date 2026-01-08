import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';  // ✅ Use fs/promises for async
const router = express.Router();
const filePath = './data.json';

// Helper: Read JSON file
async function readData() {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    return data.users || []; // ✅ Return users array
  } catch {
    return []; 
  }
}

// Helper: Write JSON file
async function writeData(users) {
  const data = { users }; // ✅ Wrap in { users: [] } structure
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Signup ✅ FIXED
router.post('/signup', async (req, res) => {
  try {
    const users = await readData();
    const { email, password, name } = req.body;
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { 
      id: Date.now().toString(), 
      email, 
      password: hashedPassword, 
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    await writeData(users);
    
    const token = jwt.sign({ userId: user.id, email: user.email }, 'development', { expiresIn: '24h' });
    res.cookie('jwt', token, { 
      httpOnly: true, 
      secure: false, // Set true in production
      sameSite: 'strict'
    }).json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } // ✅ Exclude password
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login ✅ FIXED
router.post('/login', async (req, res) => {
  try {
    const users = await readData();
    const { email, password } = req.body;
    console.log('users=========',users);
    console.log('email=========',email);
    const user = users.find(u => u.email === email);
    console.log('user=========',user);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, 'development', { expiresIn: '24h' });
    res.cookie('jwt', token, { 
      httpOnly: true, 
      secure: false,
      sameSite: 'strict'
    }).json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } // ✅ Exclude password
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ REMOVE THIS BROKEN ROUTE - it belongs in users.js
// router.get('/users', ...) // DELETE THIS

export default router;
