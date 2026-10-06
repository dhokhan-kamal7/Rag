import api from "./api";

export async function sendMessage(message, sessionId = null) {
  const response = await api.post("/chat/message", {
    message,
    session_id: sessionId
  });

  return response.data;
}

export async function getSessions() {
  const response = await api.get("/chat/sessions");

  return response.data;
}

export async function getSessionMessages(sessionId) {
  const response = await api.get(
    `/chat/sessions/${sessionId}/messages`
  );

  return response.data;
}