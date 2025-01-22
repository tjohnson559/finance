import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/loginPage"); // Redirect to login page
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            Transaction List
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add-transaction"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            Add Transaction
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Inline styles for simplicity
const styles = {
  navbar: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    justifyContent: "space-around",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
  activeLink: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;

