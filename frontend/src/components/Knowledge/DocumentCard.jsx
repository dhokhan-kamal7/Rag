import React from "react";


function DocumentCard({ document, onDelete }) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(document.id);
    }
  };


  return (
    <div>
      <h4>{document.filename}</h4>

      <p>
        Type: {document.file_type}
      </p>

      <p>
        Status: {document.status}
      </p>

      <button onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}


export default DocumentCard;