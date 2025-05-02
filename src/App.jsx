import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Lawyer from "./Lawyer";
import Chat from "./Chat";
import ClientRegister from "./Clientregister";
import LawyerRegister from "./LawyerRegister"
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Wallet from "./Wallet";
import { AuthProvider, RequireAuth, useAuth } from "./utils/authContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lawyer" element={
              <RequireAuth>
                <Lawyer />
              </RequireAuth>
            } />
            <Route path="/chat" element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            } />
            <Route path="/wallet" element={
              <RequireAuth>
                <Wallet />
              </RequireAuth>
            } />
          </Route>

          <Route path="/dashboard" element={
            <RequireAuth requiredRole="lawyer">
              <Dashboard />
            </RequireAuth>
          } />
          
          <Route path="/lawyerregister" element={<LawyerRegister />} />
          <Route path="/clientregister" element={<ClientRegister />} />
          <Route path="/login" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
