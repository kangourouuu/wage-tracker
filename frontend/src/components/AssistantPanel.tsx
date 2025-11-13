import React, { useState, useRef, useEffect } from "react";
import styles from "./AssistantPanel.module.css";
import { useAiAssistantStore } from "@/features/ai-assistant/store/aiAssistantStore";
import toast from "react-hot-toast";
import api from "@/services/api";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp?: string | Date;
  confirmationData?: any;
}

interface AssistantPanelProps {
  isDropdown?: boolean;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isDropdown,
}) => {
  const { isOpen, toggle } = useAiAssistantStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hello! I'm your AI assistant.\n\n**I can help you with:**\n• Understanding your work data and earnings\n• Analyzing your productivity patterns\n• Answering questions about your jobs\n• Processing imported work entry files\n\n**What would you like to know?**",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setIsLoading(true); // Set loading state

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/assistant/upload-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Check if we need user confirmation
        if (response.data.needsConfirmation) {
          setPendingConfirmation(response.data.data);
          const confirmMessage =
            `${response.data.message}\n\n` +
            `Work Entries Found: ${response.data.data.workEntries.length}\n\n` +
            response.data.data.workEntries
              .slice(0, 5)
              .map((entry: any, idx: number) => {
                const job = response.data.data.jobs.find(
                  (j: any) => j.id === entry.jobId
                );
                const start = new Date(entry.startTime);
                const end = new Date(entry.endTime);
                return `${idx + 1}. ${
                  job?.name || "Unknown Job"
                } - ${start.toLocaleDateString()} ${start.toLocaleTimeString()} to ${end.toLocaleTimeString()} (Break: ${
                  entry.breakDuration || 0
                }min)`;
              })
              .join("\n") +
            (response.data.data.workEntries.length > 5 ? "\n...and more" : "") +
            "\n\nPlease confirm to import these entries.";

          const aiMessage: Message = {
            sender: "ai",
            text: confirmMessage,
            confirmationData: response.data.data,
            timestamp: new Date().toISOString(),
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } else {
          const aiMessage: Message = {
            sender: "ai",
            text: response.data.message,
            timestamp: new Date().toISOString(),
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }

        toast.success("File analyzed successfully!");
      } catch (error) {
        console.error("Error uploading file to AI assistant:", error);
        toast.error("Failed to upload file to AI assistant.");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "ai",
            text: "Sorry, I am having trouble processing your file right now.",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false); // Clear loading state
        event.target.value = ""; // Clear the input
      }
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmImport = async () => {
    if (!pendingConfirmation) return;

    setIsLoading(true);
    try {
      const response = await api.post("/assistant/confirm-import", {
        workEntries: pendingConfirmation.workEntries,
      });

      const aiMessage: Message = {
        sender: "ai",
        text: response.data.message,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setPendingConfirmation(null);
      toast.success("Work entries imported successfully!");

      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error("Error importing work entries:", error);
      toast.error("Failed to import work entries.");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: "Sorry, there was an error importing the work entries.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelImport = () => {
    setPendingConfirmation(null);
    const aiMessage: Message = {
      sender: "ai",
      text: "Import cancelled. You can upload another file whenever you're ready.",
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) {
      return;
    }

    const userMessage: Message = {
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/assistant/chat", {
        message: inputMessage,
      });
      const aiMessage: Message = {
        sender: "ai",
        text: response.data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message to AI assistant:", error);
      toast.error("Failed to get response from AI assistant.");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: "Sorry, I am having trouble connecting right now.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleSendMessage();
    }
  };

  const formatAIMessage = (text: string) => {
    // Split text into lines and format them
    const lines = text.split('\n');
    const formatted: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines
      if (line.trim() === '') {
        formatted.push(<br key={`br-${key++}`} />);
        continue;
      }

      // Format bold text (**text**)
      let formattedLine = line;
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add bold text
        parts.push(<strong key={`bold-${key++}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Check if it's a bullet point
      if (line.trim().match(/^[•\-\*]\s/)) {
        formatted.push(
          <div key={`bullet-${key++}`} style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>
            {parts.length > 0 ? parts : formattedLine}
          </div>
        );
      }
      // Check if it's a numbered list
      else if (line.trim().match(/^\d+\.\s/)) {
        formatted.push(
          <div key={`number-${key++}`} style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>
            {parts.length > 0 ? parts : formattedLine}
          </div>
        );
      }
      // Regular paragraph
      else {
        formatted.push(
          <div key={`line-${key++}`} style={{ marginBottom: '0.5rem' }}>
            {parts.length > 0 ? parts : formattedLine}
          </div>
        );
      }
    }

    return formatted;
  };

  const formatTime = (date?: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent closing when clicking inside the panel
    e.stopPropagation();
  };

  return (
    <div
      className={`${styles.panel} ${!isOpen ? styles.hidden : ""} ${
        isDropdown ? styles.dropdownPanel : ""
      }`}
      onClick={handlePanelClick}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.aiAvatar}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className={styles.headerText}>
            <h3>AI Assistant</h3>
            <span className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              Online
            </span>
          </div>
        </div>
        <button
          onClick={toggle}
          className={styles.closeButton}
          aria-label="Close assistant"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${styles[msg.sender]}`}
          >
            <div className={styles.messageAvatar}>
              {msg.sender === "ai" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <path
                    d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 17C9.33 17 7.08 15.41 6 13.09C6.03 11.5 9.33 10.5 12 10.5C14.67 10.5 17.97 11.5 18 13.09C16.92 15.41 14.67 17 12 17Z"
                    fill="white"
                  />
                </svg>
              )}
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageBubble}>
                {msg.sender === "ai" ? formatAIMessage(msg.text) : msg.text}
              </div>
              {msg.timestamp && (
                <span className={styles.messageTime}>
                  {formatTime(msg.timestamp)}
                </span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.ai}`}>
            <div className={styles.messageAvatar}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {pendingConfirmation && (
        <div className={styles.confirmationBar}>
          <span className={styles.confirmationText}>
            Ready to import {pendingConfirmation.workEntries.length} work
            entries?
          </span>
          <div className={styles.confirmationButtons}>
            <button
              onClick={handleConfirmImport}
              className={styles.confirmButton}
              disabled={isLoading}
            >
              Confirm Import
            </button>
            <button
              onClick={handleCancelImport}
              className={styles.cancelButtonBar}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.inputContainer}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".csv, .xls, .xlsx, .jpg, .jpeg, .png"
        />
        <button
          type="button"
          onClick={handleFileUploadClick}
          className={styles.iconButton}
          aria-label="Upload file"
          disabled={isLoading}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <input
          type="text"
          className={styles.messageInput}
          placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || inputMessage.trim() === ""}
          className={styles.sendButton}
          aria-label="Send message"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
