// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Weather from "./components/Weather"; // Import your Wather component
import Register from "./components/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/weather" element={<Weather />} />
        {/* Add route for Wather */}
      </Routes>
    </Router>
  );
};

export default App;
