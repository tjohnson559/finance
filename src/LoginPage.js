import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch("http://localhost:5000/loginPage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const responseText = await response.text();
            console.log("Response text:", responseText);
      
          const data = JSON.parse(responseText);
          if (response.ok) {
            console.log("Login successful! Token:", data.token);
            alert("Login successful!");
            // Save token in local storage
            localStorage.setItem("token", data.token);
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error("Error logging in:", error);
          alert("Something went wrong!");
        }
      };
      
    
    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: " 0 auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
            Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} required
            />
            </div>
            <div>
            <label>
            Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} required
            />
            </div>
            <button type="submit">Submit</button>
        </form>
        <p> Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
    );
    }
    export default LoginPage;