const API_URL = "http://localhost:5000/api/transactions";

export const fetchTransactions = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const data = await response.json();
  return data;
};

export const addTransaction = async (transaction) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error("Failed to add transaction");
  }
  const data = await response.json();
  return data;
};

export const updateTransaction = async (id, updatedTransaction) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTransaction),
  });
  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }
  const data = await response.json();
  return data;
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
  return id;
};