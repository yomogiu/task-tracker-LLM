import React from 'react';
const OllamaRequestHandler = async (prompt, context) => {
  try {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("There was an error with the Ollama request:", error);
    return "Arr, there be an error: Unable to generate the message content, ye scurvy dog!";
  }
};

export default OllamaRequestHandler;