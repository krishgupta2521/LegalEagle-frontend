import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Lawyer from "./Lawyer";
import Chat from "./Chat";
import Login from "./Login";
import LawyerLogin from "./LawyerLogin"
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
        <Route path="/lawyerlogin" element={<LawyerLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}
