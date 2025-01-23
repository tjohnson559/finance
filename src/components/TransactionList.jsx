import React, { useState, useEffect } from "react";
import "../App.css";
import {
  fetchTransactions,
  deleteTransaction as deleteTransactionAPI,
} from "../repository/transactionRepository";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from the backend
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTransactions();
        console.log("Fetched transactions:", data);
        setTransactions(data); // Set state with fetched transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    getTransactions();
  }, []); // Empty array ensures it runs only once
  

  // Delete a transaction by ID
  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransactionAPI(id);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction. Please try again later.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="transaction-list-page">
      <header>
        <h1>Transaction List</h1>
      </header>
      <main>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.category || "N/A"}</td>
                    <td>{transaction.description}</td>
                    <td className={transaction.amount < 0 ? "expense" : "income"}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td>
                      {transaction.type
                        ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
                        : "N/A"}
                    </td>
                    <td>
                      <button onClick={() => handleDeleteTransaction(transaction.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default TransactionList;


