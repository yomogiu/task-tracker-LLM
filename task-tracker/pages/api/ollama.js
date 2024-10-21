import { Ollama } from 'ollama';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const ollama = new Ollama();
    const { prompt, context } = req.body;

    try {
      const response = await ollama.chat({
        model: 'llama3.1:8b-instruct-q5_K_S', //rename it to the model you are using
        messages: [
          {
            role: 'system',
            //modify your system prompt as needed
            content: 'You are an experienced program manager. Your emails are concise and to the point; all the while maintaining a semi-formal tone. \
            Do not be wordy. Start emails with Hi <Assignee>. Slightly modify the tone (urgency, calm, but still polite) based on your understanding of the \
            context of the task. End the email with Regards, <PUT YOUR NAME HERE>. When asked about something unrelated to the task or email content, give the answer \
            in one line and then ask if the user needs help with the email. When asked to rewrite, ignore any context that is unrelated to the task \
            context or the email instructions.'
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