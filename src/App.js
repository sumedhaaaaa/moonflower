import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TrackerResults from "./components/TrackerResults";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PreviousResults from "./components/PreviousResults";
import { AuthProvider } from "./context/AuthContext";
import "./responsive.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker-results" element={<TrackerResults />} />
          <Route path="/previous-results" element={<PreviousResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
