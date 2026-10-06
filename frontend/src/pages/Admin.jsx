import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";
import DocumentUpload from "../components/Knowledge/DocumentUpload";
import DocumentList from "../components/Knowledge/DocumentList";


function Admin() {
  const { user, logout } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);


  const handleUpload = () => {
    setRefreshKey((currentKey) => currentKey + 1);
  };


  return (
    <main className="admin-page">

      <header className="admin-header">

        <div className="brand">
          <div className="brand-icon">
            ✦
          </div>

          <div>
            <h1>Knowledge AI</h1>
            <span>Administration</span>
          </div>
        </div>


        <div className="admin-header-actions">

          <span className="admin-email">
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


      <section className="admin-main">

        <div className="admin-title">

          <div>
            <h2>Admin Dashboard</h2>

            <p>
              Manage the documents used by your knowledge assistant.
            </p>
          </div>

          <div className="admin-badge">
            Administrator
          </div>

        </div>


        <div className="admin-grid">

          <section className="admin-card">

            <div className="admin-card-header">
              <div>
                <h3>Knowledge Base</h3>

                <p>
                  Upload a PDF, TXT, or HTML document.
                </p>
              </div>
            </div>

            <DocumentUpload
              onUpload={handleUpload}
            />

          </section>


          <section className="admin-card">

            <div className="admin-card-header">
              <div>
                <h3>Documents</h3>

                <p>
                  Manage your existing knowledge documents.
                </p>
              </div>
            </div>

            <DocumentList
              key={refreshKey}
            />

          </section>

        </div>

      </section>

    </main>
  );
}


export default Admin;