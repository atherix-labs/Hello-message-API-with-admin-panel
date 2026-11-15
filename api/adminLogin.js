function getStore() {
  if (!global.__HELLO_MESSAGE_STORE__) {
    global.__HELLO_MESSAGE_STORE__ = {
      title: 'System Announcement',
      author: 'dagger',
      message: 'Welcome to Hello Message API.',
      lastUpdated: new Date().toISOString()
    };
  }
  return global.__HELLO_MESSAGE_STORE__;
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json(false);
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { username, password } = body;

    if (!isAuthorized(username, password)) {
      return res.status(401).json(false);
    }

    const currentModules = getStore();
    return res.status(200).json(currentModules);
  } catch (error) {
    return res.status(500).json(false);
  }
}
