import React, { useEffect, useState } from "react";

import {
  deleteDocument,
  getDocuments
} from "../../services/knowledgeService";

import DocumentCard from "./DocumentCard";


function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDocuments();
  }, []);


  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) => document.id !== documentId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to delete document."
      );
    }
  };


  if (loading) {
    return <p>Loading documents...</p>;
  }


  return (
    <div>
      <h3>Knowledge Base Documents</h3>

      {error && <p>{error}</p>}

      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default DocumentList;