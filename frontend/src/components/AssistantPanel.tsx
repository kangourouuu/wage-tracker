import React, { useState, useRef, useEffect } from 'react';
import styles from './AssistantPanel.module.css';
import { useAiAssistantStore } from '@/features/ai-assistant/store/aiAssistantStore';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AssistantPanel: React.FC = () => {
  const { isOpen, toggle } = useAiAssistantStore();
  const [messages, setMessages] = useState<Message[]>([{ sender: 'ai', text: 'Welcome! How can I help you?' }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) {
    return null;
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) {
      return;
    }

    const userMessage: Message = { sender: 'user', text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/assistant/chat', { message: inputMessage });
      const aiMessage: Message = { sender: 'ai', text: response.data };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message to AI assistant:', error);
      toast.error('Failed to get response from AI assistant.');
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>AI Assistant</h3>
        <button onClick={toggle} className={styles.closeButton}>&times;</button>
      </div>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={isLoading ? 'Thinking...' : 'Ask something...'}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
