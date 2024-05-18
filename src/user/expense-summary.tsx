import React, { useState, useEffect } from "react";
import "../css/expense-summary.css";
import axios from "axios";

function Summary({ savings, earnings, onExpenseAdded }: any) {
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentSavings, setCurrentSavings] = useState(savings);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const updatedSavingsResponse = await axios.get(
          `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/ShowTotalExpense`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updatedSavingsResponse.status === 200) {
          const totalEarning = updatedSavingsResponse.data.data.totalEarning;
          setCurrentSavings(totalEarning);
        }
      } catch (error: any) {
        setError("Error fetching data");
      }
    };

    fetchData();
  }, [onExpenseAdded]);

  const handleAddAmount = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (additionalAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/TotalExpense`,
        {
          total_expense_amount: parseFloat(
            additionalAmount as unknown as string
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAdditionalAmount(0);
        setCurrentSavings(
          (prevSavings: number) =>
            prevSavings + parseFloat(additionalAmount as unknown as string)
        );
      } else {
        setError("Error adding amount");
      }
    } catch (error) {
      setError("Error adding amount");
    }
    setLoading(false);
  };

  return (
    <div className="summary-container">
      <h2>Summary</h2>
      <form>
        <div className="user-box">
          <input
            type="text"
            value={`Current Savings: $${currentSavings}`}
            readOnly
          />
          <label>Current Savings:</label>
        </div>
        <div className="user-box">
          <input type="text" value={`Total Spend: $${earnings}`} readOnly />
          <label>Total Spend:</label>
        </div>
        <div className="user-box">
          <input
            type="number"
            value={additionalAmount}
            onChange={(e) => setAdditionalAmount(e.target.value as any)}
          />
          <label>Add Amount:</label>
        </div>
        {error && <p className="error">{error}</p>}
        <button
          type="button"
          onClick={handleAddAmount}
          className="add-button"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Amount"}
        </button>
      </form>
    </div>
  );
}

export default Summary;
