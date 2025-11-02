import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Canciones from "./components/Canciones"
import "./components/Main.css"

function Guard({ children }) {
  const ok = localStorage.getItem("session") === "ok"
  return ok ? children : <Navigate to="/login" replace />
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/app"
        element={
          <Guard>
            <Canciones />
          </Guard>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)
