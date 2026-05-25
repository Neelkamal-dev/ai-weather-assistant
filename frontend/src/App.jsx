import { useState } from 'react';

import axios from 'axios';

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

      setChat(prev => [
        ...prev,
        {
          sender: 'ai',
          text:
          'Something went wrong'
        }
      ]);
    }

    setMessage('');

    setLoading(false);
  }

  return (

    <div className="h-screen bg-gray-100 flex justify-center items-center">

      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}

        <div className="bg-black text-white p-5 text-xl font-bold">

          AI Weather Assistant

        </div>

        {/* Chat Area */}

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">

          {
            chat.map((msg, index) => (

              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow ${
                    msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-black'
                  }`}
                >
                  {msg.text}
                </div>

              </div>
            ))
          }

          {
            loading && (

              <div className="flex justify-start">

                <div className="bg-white px-4 py-3 rounded-2xl shadow">

                  Thinking...

                </div>

              </div>
            )
          }

        </div>

        {/* Input Area */}

        <div className="p-4 border-t flex gap-3 bg-white">

          <input
            type="text"
            placeholder="Ask something..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="flex-1 border rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;