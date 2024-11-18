import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const ollama = new Ollama();
    const { prompt, context } = req.body;

    try {
      // Read settings
      const settingsPath = path.join(process.cwd(), 'settings.json');
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      
      const response = await ollama.chat({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: 'You are an experienced program manager. Your emails are concise and to the point; all the while maintaining a \
            semi-formal tone. Do not be wordy. Start emails with Hi <name>. Slightly modify the tone (urgency, calm, but still polite) \
            based on your understanding of the context of the task. End the email with Regards, <name>. When asked about something \
            unrelated to the task or email content, give the answer in one line and then ask if the user needs help with the email. When \
            asked to rewrite, ignore any context that is unrelated to the task context or the email instructions.'
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nPrompt: ${prompt}`
          }
        ],
        stream: false
      });

      res.status(200).json({ content: response.message.content });
    } catch (error) {
      console.error("Arr, there be an error with the Ollama request:", error);
      res.status(500).json({ error: "Shiver me timbers! Unable to generate the message content, ye scurvy dog!" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}