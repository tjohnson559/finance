import React, { useEffect, useState } from "react";
import "../App.css";

const DashboardTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [dashboardError, setDashboardError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");

  useEffect(() => {
    // Fetch dashboard summary data
    fetch("http://localhost:5000/api/dashboard")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
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
        if (!response.ok) throw new Error("Failed to fetch transactions");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched transactions:", data); // Log the fetched transactions
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setTransactionsError("Failed to load transactions.");
      });
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

        {/* Transactions Section */}
        <section className="transactions">
          <h2>Recent Transactions</h2>
          <ul id="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                // Validate transaction fields
                if (
                  !transaction ||
                  typeof transaction.type !== "string" || // Ensure `type` is a string
                  typeof transaction.amount !== "number" || // Ensure `amount` is a number
                  typeof transaction.description !== "string" // Ensure `description` is a string
                ) {
                  console.warn("Invalid transaction data:", transaction);
                  return <li key={index}>Invalid transaction data</li>;
                }

                const description = transaction.description || "No description"; // Fallback for missing description
                const type = transaction.type.toUpperCase(); // Ensure uppercase for type

                return (
                  <li key={transaction.id || index}>
                    {type}: ${transaction.amount.toFixed(2)} - {description}
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



