import React, { useState } from 'react';
import { addTransaction as addTransactionAPI } from '../repository/transactionRepository';

const AddTransaction = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!amount || !date || !type) {
      setError('Please fill in all required fields.');
      setSuccess('');
      return;
    }

    // Prepare data to be sent to the backend
    let transactionAmount = parseFloat(amount);
    if (type === 'expense') {
      transactionAmount = -Math.abs(transactionAmount); // Ensure the amount is negative for expenses
    }

    const transactionData = {
      amount: transactionAmount,
      date,
      type,
      description,
      category,
    };

    try {
      setLoading(true);
      const result = await addTransactionAPI(transactionData);
      setSuccess('Transaction added successfully!');
      setError('');
      // Clear form fields
      setAmount('');
      setDate('');
      setType('income');
      setDescription('');
      setCategory('');
      // Call the callback function to update the transactions list
      onAddTransaction(result);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setError('Failed to add transaction.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: '100vh', // Full height of the viewport
        backgroundColor: '#f9f9f9',
        padding: '20px',
      }}
    >
      <header
        style={{
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'light green',
          padding: '20px 0',
          color: '#fff',
        }}
      >
        <h1>Add Transaction</h1>
      </header>
      <main style={{ width: '100%', marginTop: '20px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '800px', // Limit form width
            margin: '0 auto', // Center form horizontally
            display: 'flex',
            flexDirection: 'column',
            gap: '20px', // Spacing between form elements
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Amount:
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                padding: '15px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                padding: '15px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Type:
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              style={{
                padding: '15px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '100%',
              }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Description:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                padding: '15px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Category:
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                padding: '15px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '100%',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px',
              fontSize: '1.2rem',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '100%',
            }}
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
        {error && (
          <p style={{ color: 'red', fontSize: '1rem', marginTop: '15px', textAlign: 'center' }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: 'green', fontSize: '1rem', marginTop: '15px', textAlign: 'center' }}>
            {success}
          </p>
        )}
      </main>
    </div>
  );
};

export default AddTransaction;

