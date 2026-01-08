// utils/dataService.js
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export const getUsers = async (page = 1, limit = 10) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const users = jsonData.users.slice(startIndex, endIndex);
    const total = jsonData.users.length;
    
    return {
      users,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    };
  } catch (error) {
    console.error('Error reading data.json:', error);
    throw new Error('Failed to fetch users');
  }
};

export const addUser = async (userData) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    jsonData.users.push(newUser);
    await fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2));
    
    return newUser;
  } catch (error) {
    throw new Error('Failed to add user');
  }
};
