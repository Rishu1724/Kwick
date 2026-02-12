import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ChatWindow.css';

const ChatWindow = ({ productId, sellerId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [productId, sellerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Generate conversation ID by sorting user IDs and joining them
      const userIds = [user._id, sellerId].sort();
      const conversationId = userIds.join('-');
      
      // Fetch existing messages for this conversation
      const response = await api.get(`/api/chats/${conversationId}`);
      setMessages(response.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        receiverId: sellerId,
        productId,
        message: newMessage
      };

      const response = await api.post('/api/chats', messageData);
      
      // Add the sent message to the local state
      setMessages(prevMessages => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (loading) return <div className="chat-window">Loading...</div>;
  if (error) return <div className="chat-window error">{error}</div>;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat with Seller</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id} 
              className={`message ${message.senderId._id === user._id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.message}
              </div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;