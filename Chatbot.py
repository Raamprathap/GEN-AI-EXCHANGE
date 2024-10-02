import google.generativeai as genai
import google.api_core.exceptions

genai.configure(api_key="AIzaSyCr2RdUvkM0FDn8-Am-rwVJXYygfty5OUo")

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-pro",
  generation_config=generation_config,
  # safety_settings = Adjust safety settingsw
  # See https://ai.google.dev/gemini-api/docs/safety-settings
  system_instruction="You are an AI powered chatbot to provide mentalhealth and emotional support to students",
)

history = []
while True:

  chat_session = model.start_chat(history = history)
  u = input("User: ")
  try:
    model_response = chat_session.send_message(u)
    response = model_response.text
  except google.api_core.exceptions.InternalServerError as e:
     print("Try again")
     continue

  print("\nChatbot: ", response)
  if u in ["quit", "exit", "bye"]:
      break 

  history.append({
      "role": "user",
      "parts": [u,],
      })
  history.append({
      "role": "model",
      "parts": [response,],
      })


# from flask import Flask, request, jsonify
# import google.generativeai as genai
# import google.api_core.exceptions

# app = Flask(__name__)

# genai.configure(api_key="AIzaSyCr2RdUvkM0FDn8-Am-rwVJXYygfty5OUo")

# generation_config = {
#     "temperature": 1,
#     "top_p": 0.95,
#     "top_k": 64,
#     "max_output_tokens": 8192,
#     "response_mime_type": "text/plain",
# }

# model = genai.GenerativeModel(
#     model_name="gemini-1.5-pro",
#     generation_config=generation_config,
#     system_instruction="You are an AI powered chatbot to provide mental health and emotional support to students",
# )

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_input = request.json.get('prompt')
#     history = []  # You may want to manage history here

#     try:
#         chat_session = model.start_chat(history=history)
#         model_response = chat_session.send_message(user_input)
#         response = model_response.text
#         return jsonify({"response": response})
#     except google.api_core.exceptions.InternalServerError:
#         return jsonify({"error": "Internal Server Error"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)