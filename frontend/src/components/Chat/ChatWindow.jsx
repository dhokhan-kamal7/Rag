import React, { useEffect, useState } from "react";

import {
  getSessionMessages,
  sendMessage
} from "../../services/chatService";

import Message from "./Message";
import MessageInput from "./MessageInput";
import LoadingMessage from "./LoadingMessage";


function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const savedSessionId = localStorage.getItem(
      "chat_session_id"
    );

    if (!savedSessionId) {
      return;
    }

    const sessionIdNumber = Number(savedSessionId);

    setSessionId(sessionIdNumber);

    getSessionMessages(sessionIdNumber)
      .then((data) => {
        setMessages(data);
      })
      .catch(() => {
        localStorage.removeItem("chat_session_id");
        setSessionId(null);
      });
  }, []);


  const handleSend = async (message) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: message
      }
    ]);

    setLoading(true);

    try {
      const data = await sendMessage(
        message,
        sessionId
      );

      setSessionId(data.session_id);

      localStorage.setItem(
        "chat_session_id",
        data.session_id
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.response
        }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            error.response?.data?.detail ||
            "Something went wrong. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleNewChat = () => {
    localStorage.removeItem("chat_session_id");

    setSessionId(null);
    setMessages([]);
  };


  return (
    <div>
      <h2>AI Knowledge Chatbot</h2>

      <button onClick={handleNewChat}>
        New Chat
      </button>

      <div>
        {messages.map((message, index) => (
          <Message
            key={`${message.role}-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}

        {loading && <LoadingMessage />}
      </div>

      <MessageInput
        onSend={handleSend}
        disabled={loading}
      />
    </div>
  );
}


export default ChatWindow;