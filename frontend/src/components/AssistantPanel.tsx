import React, { useState, useRef, useEffect } from 'react';
import styles from './AssistantPanel.module.css';
import { useAiAssistantStore } from '@/features/ai-assistant/store/aiAssistantStore';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AssistantPanelProps {
  isDropdown?: boolean;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ isDropdown }) => {
  const { isOpen, toggle } = useAiAssistantStore();
  const [messages, setMessages] = useState<Message[]>([{ sender: 'ai', text: 'Welcome! How can I help you?' }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      // Here you would typically upload the file or process it
      // For now, just log and clear the input
      event.target.value = ''; // Clear the input so the same file can be selected again
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

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
    <div className={`${styles.panel} ${!isOpen ? styles.hidden : ''}`}>
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
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".csv, .xls, .xlsx, .jpg, .jpeg, .png" // Specify accepted file types
        />
        <button type="button" onClick={handleFileUploadClick} className={styles.uploadButton}>
          Upload
        </button>
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
