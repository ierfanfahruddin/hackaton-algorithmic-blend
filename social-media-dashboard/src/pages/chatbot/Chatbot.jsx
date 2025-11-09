import React from 'react';
import './Chatbot.css';

const Chatbot = () => {
  return (
    <div className="chatbot-container">
      <div className="chatbot-messages"></div>
      <div className="chatbot-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
