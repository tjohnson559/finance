import React, { useState, useEffect } from "react";
import "../App.css";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch transactions from an API
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions"); // Update this URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        console.log("Fetched transactions:", data); // Log the fetched transactions

        // Validate and convert transaction data
        const validatedData = data.map((transaction) => {
          const amount = parseFloat(transaction.amount);
          if (
            typeof transaction.id !== "number" ||
            typeof transaction.date !== "string" ||
            typeof transaction.category !== "string" ||
            typeof transaction.description !== "string" ||
            typeof transaction.type !== "string" || // Ensure type is a string
            isNaN(amount)
          ) {
            console.error("Invalid transaction data:", transaction);
            return null; // Skip invalid transaction data
          }

          return {
            ...transaction,
            amount, // Use the parsed amount
          };
        }).filter(transaction => transaction !== null); // Filter out invalid transactions

        setTransactions(validatedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="transaction-list-page">
      <header>
        <h1>Transaction List</h1>
      </header>
      <main>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th> {/* Add a header for the type */}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td> {/* Format date */}
                  <td>{transaction.category || "N/A"}</td>
                  <td>{transaction.description}</td>
                  <td className={transaction.amount < 0 ? "expense" : "income"}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td>{transaction.type}</td> {/* Display the type */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default TransactionList;

