// src/App.js
import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function AppContent() {
  const location = useLocation();
  
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


