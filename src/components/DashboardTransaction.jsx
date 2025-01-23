import React, { useEffect, useState } from "react";
import "../App.css";

const DashboardTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [dashboardError, setDashboardError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setTotalIncome(data.totalIncome || 0);
        setTotalExpenses(data.totalExpenses || 0);
        setNetBalance(data.netBalance || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardError("Failed to load dashboard summary. Please try again later.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions");
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        console.log("Fetched transactions:", data); // Log the fetched transactions
        const validatedTransactions = data.map((transaction) => {
          const amount = parseFloat(transaction.amount); // Convert amount to a number

          // Validate required fields
          if (
            typeof transaction.id !== "number" ||
            typeof transaction.date !== "string" ||
            typeof transaction.category !== "string" ||
            typeof transaction.description !== "string" ||
            typeof transaction.type !== "string" || // Ensure `type` is a string
            isNaN(amount) // Ensure `amount` is a valid number
          ) {
            console.error("Invalid transaction data:", transaction);
            return null; // Skip invalid transaction data
          }

          // Return validated and transformed transaction
          return {
            ...transaction,
            amount, // Ensure `amount` is a number
            type: transaction.type.toLowerCase(), // Normalize `type` to lowercase (optional)
          };
        }).filter(transaction => transaction !== null);
        setTransactions(validatedTransactions); // Remove invalid transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactionsError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchTransactions();
  }, []);

  return (
    <div className="dashboard">
      <header>
        <h1>Transaction Dashboard</h1>
      </header>
      <main>
        {/* Dashboard Error */}
        {dashboardError && <p style={{ color: "red" }}>{dashboardError}</p>}

        {/* Summary Section */}
        <section className="summary">
          <div className="card">
            <h2>Total Income</h2>
            <p id="total-income">${Number(totalIncome).toFixed(2)}</p>
          </div>
          <div className="card">
            <h2>Total Expenses</h2>
            <p id="total-expenses">${Number(totalExpenses).toFixed(2)}</p>
          </div>
          <div className="card">
            <h2>Net Balance</h2>
            <p id="net-balance">${Number(netBalance).toFixed(2)}</p>
          </div>
        </section>

        {/* Transactions Error */}
        {transactionsError && <p style={{ color: "red" }}>{transactionsError}</p>}

        {/* Loading State */}
        {loading && <p>Loading...</p>}

        {/* Transactions Section */}
        <section className="transactions">
          <h2>Recent Transactions</h2>
          <ul id="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                const description = transaction.description || "No description";
                const type = transaction.type.toUpperCase();
                
                return (
                  <li key={transaction.id || index}>
                    {type}: ${transaction.amount.toFixed(2)} - {description}
                  </li>
                );
              })
            ) : (
              !loading && <p>No transactions available.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardTransaction;
     



