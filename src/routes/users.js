import express from 'express';
import fs from 'fs/promises';
const router = express.Router();
const filePath = './data.json';

async function readData() {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    console.log("data======",data);
    return data || [];
  } catch {
    return [];
  }
}

router.get('/', async (req, res) => {
  console.log("inside users============");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const users = await readData();

    console.log('users========',users);
    
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);
    
    res.json({
      success: true,
      users: paginatedUsers.map(({ password, ...user }) => user), // ✅ Remove password
      pagination: {
        page,
        pages: Math.ceil(users.length / limit),
        total: users.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
