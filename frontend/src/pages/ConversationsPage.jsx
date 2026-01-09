import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ChatWindow from '../components/Chat/ChatWindow';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch conversations from the backend
      // const response = await api.get('/api/chats/conversations');
      // setConversations(response.data);
      setConversations([]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
  };

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="conversations-page">
      <h1>My Conversations</h1>
      
      {conversations.length === 0 ? (
        <p>You don't have any conversations yet.</p>
      ) : (
        <div className="conversations-container">
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div 
                key={conversation.conversationId}
                className={`conversation-item ${selectedConversation?.conversationId === conversation.conversationId ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="conversation-info">
                  <h3>
                    {conversation.participants.find(p => p._id !== user._id)?.name || 'Unknown User'}
                  </h3>
                  <p className="last-message">
                    {conversation.lastMessage?.message || 'No messages yet'}
                  </p>
                </div>
                <div className="conversation-meta">
                  <span className="timestamp">
                    {new Date(conversation.lastMessage?.createdAt).toLocaleDateString()}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="unread-count">{conversation.unreadCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {selectedConversation && (
            <ChatWindow 
              productId={selectedConversation.product?._id}
              sellerId={selectedConversation.participants.find(p => p._id !== user._id)?._id}
              onClose={handleCloseChat}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;