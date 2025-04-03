import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // Adjust path for styles

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the conversation
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);

    try {
      // Send input to the backend API
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/chatbot`, 
        { params: { query: input } }
      );

      // Append bot's response
      setMessages([...newMessages, { text: response.data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...newMessages, { text: "Sorry, something went wrong.", sender: "bot" }]);
    }

    setInput(""); // Clear input field
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {isOpen ? "Close" : "Chat"}
      </button>

      {isOpen && (
        <div className="chatbot-content">
          <div className="chatbot-header">
            <h4>Chat Assistant</h4>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
