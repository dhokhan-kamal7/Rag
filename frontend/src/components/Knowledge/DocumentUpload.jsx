import React, { useState } from "react";

import { uploadDocument } from "../../services/knowledgeService";


function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await uploadDocument(file);

      setMessage("Document uploaded successfully.");
      setFile(null);

      event.target.reset();

      if (onUpload) {
        onUpload();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Failed to upload document."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Upload Knowledge Document</h3>

      <input
        type="file"
        accept=".pdf,.txt,.html,.htm"
        onChange={(event) =>
          setFile(event.target.files[0] || null)
        }
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}


export default DocumentUpload;