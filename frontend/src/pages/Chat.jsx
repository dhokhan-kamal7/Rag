import React, { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";


function Chat() {
  const { user, logout } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);


  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    setMessage("");
    setSending(true);

    try {
      const response = await api.post(
        "/chat/message",
        {
          message: trimmedMessage,
          session_id: sessionId
        }
      );

      const data = response.data;

      setSessionId(data.session_id);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.response
        }
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while processing your message."
        }
      ]);
    } finally {
      setSending(false);
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };


  const newChat = () => {
    setMessages([]);
    setSessionId(null);
    setMessage("");
  };


  return (
    <div className="chat-app">

      <header className="chat-header">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h1>Knowledge AI</h1>
            <span>AI Knowledge Assistant</span>
          </div>
        </div>

        <div className="header-actions">
          <span className="user-email">
            {user?.email}
          </span>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>


      <main className="chat-main">

        <div className="chat-toolbar">
          <div>
            <h2>Knowledge Assistant</h2>
            <p>
              Ask questions based on your organization's knowledge base.
            </p>
          </div>

          <button
            className="new-chat-button"
            onClick={newChat}
          >
            + New Chat
          </button>
        </div>


        <section className="chat-container">

          <div className="messages-area">

            {messages.length === 0 && (
              <div className="welcome-state">

                <div className="welcome-icon">
                  ✦
                </div>

                <h2>
                  How can I help you?
                </h2>

                <p>
                  Ask me anything about the information available
                  in the knowledge base.
                </p>

                <div className="suggestions">
                  <button
                    onClick={() =>
                      setMessage(
                        "When was our company founded?"
                      )
                    }
                  >
                    When was our company founded?
                  </button>

                  <button
                    onClick={() =>
                      setMessage(
                        "What services does our company provide?"
                      )
                    }
                  >
                    What services do we provide?
                  </button>
                </div>

              </div>
            )}


            {messages.map((item, index) => (
              <div
                key={index}
                className={`message-row ${
                  item.role === "user"
                    ? "user-row"
                    : "assistant-row"
                }`}
              >

                <div
                  className={`message-avatar ${
                    item.role === "user"
                      ? "user-avatar"
                      : "assistant-avatar"
                  }`}
                >
                  {item.role === "user" ? "U" : "✦"}
                </div>

                <div
                  className={`message-bubble ${
                    item.role === "user"
                      ? "user-bubble"
                      : "assistant-bubble"
                  }`}
                >
                  {item.content}
                </div>

              </div>
            ))}


            {sending && (
              <div className="message-row assistant-row">

                <div className="message-avatar assistant-avatar">
                  ✦
                </div>

                <div className="message-bubble assistant-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>


          <div className="composer-area">

            <div className="composer">

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask something about your knowledge base..."
                rows={1}
                disabled={sending}
              />

              <button
                className="send-button"
                onClick={sendMessage}
                disabled={
                  sending ||
                  !message.trim()
                }
              >
                {sending ? "..." : "Send"}
                {!sending && <span>→</span>}
              </button>

            </div>

            <p className="composer-hint">
              Press Enter to send · Shift + Enter for a new line
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}


export default Chat;