import React, { useState } from "react";


function MessageInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    await onSend(trimmedMessage);
    setMessage("");
  };


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask something..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
      />

      <button
        type="submit"
        disabled={disabled || !message.trim()}
      >
        Send
      </button>
    </form>
  );
}


export default MessageInput;