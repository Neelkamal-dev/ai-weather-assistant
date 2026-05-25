import { useState } from 'react';

import axios from 'axios';

import './App.css';

function App() {

  const [message, setMessage] =
  useState('');

  const [chat, setChat] =
  useState([]);

  const [loading, setLoading] =
  useState(false);

  async function sendMessage() {

    if (!message.trim()) return;

    const userMessage = {
      sender: 'user',
      text: message
    };

    setChat(prev => [
      ...prev,
      userMessage
    ]);

    setLoading(true);

    try {

      const response =
      await axios.post(
        'http://localhost:3000/chat',
        {
          message
        }
      );

      const aiMessage = {
        sender: 'ai',
        text:
        response.data.response
      };

      setChat(prev => [
        ...prev,
        aiMessage
      ]);

    } catch (error) {

      const aiMessage = {
        sender: 'ai',
        text:
        'Something went wrong'
      };

      setChat(prev => [
        ...prev,
        aiMessage
      ]);
    }

    setMessage('');

    setLoading(false);
  }

  return (

    <div className="container">

      <h1>
        AI Weather Assistant
      </h1>

      <div className="chat-box">

        {
          chat.map((msg, index) => (

            <div
              key={index}
              className={
                msg.sender === 'user'
                ? 'user-message'
                : 'ai-message'
              }
            >
              {msg.text}
            </div>
          ))
        }

        {
          loading && (
            <div className="ai-message">
              Thinking...
            </div>
          )
        }

      </div>

      <div className="input-box">

        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default App;