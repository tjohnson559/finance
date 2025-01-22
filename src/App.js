import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import DashboardTransaction from "./components/DashboardTransaction";
import TransactionList from "./components/TransactionList";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AddTransaction from "./components/AddTransaction";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
              <Navbar /> {/* Add the Navbar component */}
              <DashboardTransaction />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <>
              <Navbar /> {/* Add the Navbar component */}
              <TransactionList />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-Transaction"
          element={
            <ProtectedRoute>
              <>
              <Navbar /> {/* Add the Navbar component */}
              <AddTransaction  /> {/*Render the addTransaction component */}
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
