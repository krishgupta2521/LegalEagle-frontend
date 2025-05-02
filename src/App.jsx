import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Lawyer from "./Lawyer";
import Chat from "./Chat";
import Login from "./Login";
<<<<<<< HEAD
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
=======
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import { AuthProvider, useAuth } from "./utils/authContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
{/* public rotue */}

            <Route path="/" element={<Home />} />
            <Route path="/lawyer" element={<Lawyer />} />
            
            {/* protected route */}
            <Route element={<ProtectedRoute><React.Fragment /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
  );
}
