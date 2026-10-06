import React from "react";


function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div>
      <strong>
        {isUser ? "You" : "Assistant"}
      </strong>

      <p>{content}</p>
    </div>
  );
}


export default Message;