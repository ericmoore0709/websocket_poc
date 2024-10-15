import { useEffect, useState } from 'react';
import './App.css'
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [inputUsername, setInputUsername] = useState('');

  useEffect(() => {
    // Listen for messages from the server
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for chat history from the server
    socket.on('chatHistory', (messages) => {
      setMessages(messages);  // Load the initial chat history
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.off('chatMessage');
      socket.off('chatHistory');
    };
  }, []);

  const handleUsernameSubmit = () => {
    setUsername(inputUsername);
    socket.emit('setUsername', inputUsername);  // Send the username to the server
  };

  const sendMessage = () => {
    socket.emit('chatMessage', message);  // Send the message to the server
    setMessage('');  // Clear the input field
  };

  return (
    <div>
      {!username ? (
        <div>
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button onClick={handleUsernameSubmit}>Submit Username</button>
        </div>
      ) : (
        <div>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.username}: </strong>{msg.message}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );

}

export default App
