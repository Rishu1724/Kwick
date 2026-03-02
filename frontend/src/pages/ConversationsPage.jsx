import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ChatWindow from '../components/Chat/ChatWindow';
import './ConversationsPage.css';

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
      const response = await api.get('/api/chats/conversations');
      setConversations(response.data);
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

  const isSameId = (a, b) => {
    if (!a || !b) return false;
    return a.toString?.() ? a.toString() === b.toString() : String(a) === String(b);
  };

  const getOtherUser = (conversation) => {
    const participants = Array.isArray(conversation?.participants) ? conversation.participants : [];
    const other = participants.find((p) => p && !isSameId(p._id, user?._id));
    if (other) return other;
    const last = conversation?.lastMessage;
    const sender = last?.senderId;
    const receiver = last?.receiverId;
    if (sender && receiver) {
      return isSameId(sender?._id, user?._id) ? receiver : sender;
    }
    return null;
  };

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="conversations-page">
      <div className="cp-header">
        <h2 className="cp-title">My Conversations</h2>
        <button className="cp-refresh" onClick={fetchConversations}>Refresh</button>
      </div>
      
      {conversations.length === 0 ? (
        <p className="cp-empty">You don't have any conversations yet.</p>
      ) : (
        <div className="conversations-container">
          <div className="conversations-list">
            {conversations.map((conversation) => (
              (() => {
                const other = getOtherUser(conversation);
                const otherName = other?.name || 'Unknown User';
                const otherInitial = otherName?.charAt(0)?.toUpperCase?.() || 'U';
                const productTitle = conversation.product?.title || 'Equipment';
                const productRate = conversation.product?.dailyRate;

                return (
              <div 
                key={conversation.conversationId}
                className={`conversation-item ${selectedConversation?.conversationId === conversation.conversationId ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="cp-avatar">{otherInitial}</div>

                <div className="conversation-info">
                  <div className="cp-row">
                    <h3 className="cp-name">{otherName}</h3>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-count">{conversation.unreadCount}</span>
                    )}
                  </div>

                  <div className="cp-sub">
                    <span className="cp-product">{productTitle}</span>
                    {typeof productRate === 'number' ? <span className="cp-dot">•</span> : null}
                    {typeof productRate === 'number' ? <span className="cp-rate">₹{productRate}/day</span> : null}
                  </div>

                  <p className="last-message">
                    {conversation.lastMessage?.message || 'No messages yet'}
                  </p>
                </div>

                <div className="conversation-meta">
                  <span className="timestamp">
                    {conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
                );
              })()
            ))}
          </div>
          
          {selectedConversation && (
            <ChatWindow 
              productId={selectedConversation.product?._id}
              sellerId={getOtherUser(selectedConversation)?._id}
              onClose={handleCloseChat}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;