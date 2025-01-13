import React, { useEffect, useState } from "react";
import "../App.css";

const DashboardTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [dashboardError, setDashboardError] = useState(""); // Separate error for dashboard
  const [transactionsError, setTransactionsError] = useState(""); // Separate error for transactions

  useEffect(() => {
    // Fetch dashboard summary data
    fetch("http://localhost:5000/api/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return response.json();
      })
      .then((data) => {
        setTotalIncome(data.totalIncome || 0);
        setTotalExpenses(data.totalExpenses || 0);
        setNetBalance(data.netBalance || 0);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setDashboardError("Failed to load dashboard summary.");
      });

    // Fetch transactions
    fetch("http://localhost:5000/api/transactions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setTransactionsError("Failed to load transactions.");
      });
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="dashboard">
      <header>
        <h1>Transaction Dashboard</h1>
      </header>
      <main>
        {/* Dashboard error */}
        {dashboardError && <p style={{ color: "red" }}>{dashboardError}</p>}

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

        {/* Transactions error */}
        {transactionsError && <p style={{ color: "red" }}>{transactionsError}</p>}

        <section className="transactions">
          <h2>Recent Transactions</h2>
          <ul id="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                if (!transaction || typeof transaction.type !== "string" || typeof transaction.amount === "undefined") {
                  console.warn("Invalid transaction data:", transaction); // Log invalid data
                  return <li key={index}>Invalid transaction data</li>;
                }

                const amount = Number(transaction.amount);
                
                return (
                  <li key={transaction.id || index}>
                    {transaction.type.toUpperCase()}: $
                    {Number(transaction.amount).toFixed(2)}
                  </li>
                );
              })
            ) : (
              <p>No transactions available.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardTransaction;


