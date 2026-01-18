// src/components/common/Loader.jsx
import React from "react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div className="spinner-border text-primary" role="status" />
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );
}
