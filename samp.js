const axios = require('axios');

const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const modelEndpoint = 'https://api.gemini.dev/v1/models/gemini-1.5-pro:generate';

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 64,
  max_output_tokens: 8192,
  response_mime_type: 'text/plain',
};

let history = [];

async function startChat() {
  let chatSessionId = null;

  while (true) {
    const userMessage = await getUserInput('User: ');

    if (userMessage.toLowerCase() === 'quit' || userMessage.toLowerCase() === 'exit') {
      break;
    }

    try {
      const response = await sendMessage(userMessage, chatSessionId);
      console.log('\nchatbot:', response);

      history.push({
        role: 'user',
        parts: [userMessage],
      });

      history.push({
        role: 'model',
        parts: [response],
      });

      chatSessionId = response.session_id;
    } catch (error) {
      console.error('Error:', error.message);
      console.log('Try again');
    }
  }
}

async function sendMessage(message, sessionId) {
  const requestBody = {
    model_name: 'gemini-1.5-pro',
    session_id: sessionId,
    generation_config: generationConfig,
    message: message,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  try {
    const response = await axios.post(modelEndpoint, requestBody, { headers });
    return response.data.text;
  } catch (error) {
    throw new Error(error.response.data.error.message);
  }
}

function getUserInput(prompt) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(prompt, userInput => {
      readline.close();
      resolve(userInput);
    });
  });
}
 
startChat();
