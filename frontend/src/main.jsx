import React from "react"
import "./components/Main.css"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Canciones from "./components/Canciones"

function Guard({ children }) {
  const ok = localStorage.getItem("session") === "ok"
  return ok ? children : <Navigate to="/login" />
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Guard><Canciones /></Guard>} />
    </Routes>
  </BrowserRouter>
)