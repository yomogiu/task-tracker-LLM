import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'settings.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(settingsPath)) {
        const defaultSettings = {
          model: 'llama3.1:8b-instruct-q5_K_S',
          primaryColor: '#7C3AED',
          fontFamily: 'Arial',
          storageMethod: 'JSON'
        };
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
        return res.status(200).json(defaultSettings);
      }
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read settings' });
    }
  } else if (req.method === 'POST') {
    try {
      fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 2));
      res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}