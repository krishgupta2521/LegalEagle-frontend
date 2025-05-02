import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Lawyer from "./Lawyer";
import Chat from "./Chat";
import ClientRegister from "./Clientregister";
import LawyerRegister from "./LawyerRegister"
import Dashboard from "./Dashboard";
import Signup from "./Signup";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lawyer" element={<Lawyer />} />
          <Route path="/chat" element={<Chat />} />
        </Route>


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lawyerregister" element={<LawyerRegister />} />
        <Route path="/clientregister" element={<ClientRegister />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}
