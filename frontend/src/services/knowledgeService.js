import api from "./api";

export async function uploadDocument(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/knowledge/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
}

export async function getDocuments() {
  const response = await api.get(
    "/knowledge/documents"
  );

  return response.data;
}

export async function deleteDocument(documentId) {
  const response = await api.delete(
    `/knowledge/documents/${documentId}`
  );

  return response.data;
}