import fs from 'fs';

const filePath = '/tmp/hello_message.json';

function getData() {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {}
  
  return {
    title: 'Test Announcement',
    author: 'dagger',
    message: 'This is a test/example API message.',
    lastUpdated: new Date().toISOString()
  };
}

function isAuthorized(username, password) {
  if (!username || !password) return false;
  const validKey = process.env.key;
  const userRole = process.env[username];
  return Boolean(validKey && password === validKey && userRole === 'admin');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json(false);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { username, password } = body;

    if (!isAuthorized(username, password)) {
      return res.status(401).json(false);
    }

    return res.status(200).json(getData());
  } catch (error) {
    return res.status(500).json(false);
  }
}
