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
let chatSessionId = null;

document.getElementById('send-btn').addEventListener('click', async function () {
  const userMessage = document.getElementById('user-input').value;
  document.getElementById('user-input').value = '';

  if (userMessage.toLowerCase() === 'quit' || userMessage.toLowerCase() === 'exit') {
    return;
  }

  try {
    const responseText = await sendMessage(userMessage, chatSessionId);

    // Display the user message
    displayMessage('User', userMessage);

    // Display the chatbot response
    displayMessage('Chatbot', responseText);

    history.push({
      role: 'user',
      parts: [userMessage],
    });

    history.push({
      role: 'model',
      parts: [responseText],
    });

    // Keep track of the chat session ID
    chatSessionId = responseText.session_id;
  } catch (error) {
    console.error('Error:', error.message);
    alert('Try again');
  }
});

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

function displayMessage(sender, message) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.textContent = `${sender}: ${message}`;
  chatBox.appendChild(messageDiv);
}
