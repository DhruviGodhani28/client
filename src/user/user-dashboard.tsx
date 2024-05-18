import { useState, useEffect } from "react";
import ExpenseForm from "./expenses";
import SummaryForm from "./expense-summary";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Graph } from "./graph";

function Dashboard() {
  const [currentMonthData, setCurrentMonthData] = useState({
    savings: 0,
    earnings: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTotalExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
      const response = await axios.get(
        "http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/ShowTotalExpense",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const savings = response.data.data.totalEarning;
      const earnings = response.data.data.totalSpend;
      setCurrentMonthData((prevData) => ({
        ...prevData,
        savings: savings,
        earnings: earnings,
      }));
    } catch (error) {
      console.error("Error fetching total expense:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 style={{ color: "white", marginLeft: "-900px", marginTop: "90px" }}>
        Expense Management
      </h2>
      {/* Logout Button */}
      <div className="summary-form">
        <SummaryForm
          savings={currentMonthData.savings}
          earnings={currentMonthData.earnings}
        />
      </div>
      <div className="graph">
        <Graph
          savings={currentMonthData.savings}
          earnings={currentMonthData.earnings}
        />
      </div>
      <div className="expense-form">
        <ExpenseForm onExpenseAdded={fetchTotalExpense} />
      </div>
    </div>
  );
}

export default Dashboard;
