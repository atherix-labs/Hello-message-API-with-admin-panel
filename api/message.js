import fs from 'fs';

const filePath = '/tmp/hello_message.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  let data = {
    title: 'Test Announcement',
    author: 'dagger',
    message: 'This is a test/example API message.',
    lastUpdated: new Date().toISOString()
  };

  try {
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {}

  return res.status(200).json(data);
}
