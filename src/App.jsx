import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Lawyer from "./Lawyer";
import Chat from "./Chat"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lawyer" element={<Lawyer />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
}
