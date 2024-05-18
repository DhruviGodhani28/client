import React, { useEffect, useState } from "react";
//@ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/expense-form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  mobile_no: string;
  email: string;
  password: string;
  totalEarning: number;
  totalSpend: number;
}

function ExpenseForm({ onExpenseAdded }: any) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [showForm, setShowForm] = useState(true);
  const [expenses, setExpenses] = useState<any>([]);
  const [, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setSelectedExpenseId] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFields, setDeleteFields] = useState<any>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedFields, setEditedFields] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/Create`,
        {
          name: name,
          amount: amount,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onExpenseAdded(amount);
        fetchData();
        // Reset form fields
        setName("");
        setAmount("");
        setDate(null);
        setShowForm(true);
      } else {
        setShow(true);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    const selectedLeave = expenses.find(
      (request: Expense) => request.id === id
    );
    setSelectedExpenseId(id);
    setDeleteFields(selectedLeave);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedExpenseId(null);
    setDeleteFields({});
  };
  const handleDeleteLeaveRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/Delete/${deleteFields.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      handleDeleteModalClose();
    } catch (error) {
      console.error("Error Deleting leave request:", error);
    }
  };

  const handleEdit = (id: string) => {
    const selectedLeave = expenses.find(
      (request: Expense) => request.id === id
    );
    setSelectedExpenseId(id);
    setEditedFields(selectedLeave);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedExpenseId(null);
    setEditedFields({});
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://ec2-54-204-149-34.compute-1.amazonaws.com/api/Expense/Update`,
        {
          id: editedFields.id,
          name: editedFields.name,
          amount: editedFields.amount,
          date: editedFields.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      handleEditModalClose();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleAddAllRecords = () => {
    setShowForm(false);
    fetchData();
  };

  const handleBackButtonClick = () => {
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const filteredExpense = expenses.filter(
    (expense: Expense) =>
      (expense.name &&
        expense.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.amount &&
        expense.amount
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );
  return (
    <>
      <div className="expense-box">
        {showForm ? (
          <>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="user-box">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label>Expense Name</label>
              </div>
              <div className="user-box">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <label>Amount</label>
              </div>
              <div className="user-box">
                <DatePicker
                  selected={date}
                  onChange={(date: any) => setDate(date)}
                  maxDate={new Date()}
                  placeholderText="Expense - Data"
                />
              </div>
              <div className="button-container">
                <button type="submit" className="btn btn-primary">
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={handleAddAllRecords}
                >
                  All Records
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <input
              className="d-flex justify-content-start"
              type="text"
              placeholder="Search here..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table
              className="table-container"
              style={{ marginLeft: "-28px", background: "transparent" }}
            >
              <thead>
                <tr>
                  <th style={{ backgroundColor: "transparent" }}>Name</th>
                  <th style={{ backgroundColor: "transparent" }}>Amount</th>
                  <th style={{ backgroundColor: "transparent" }}>Date</th>
                  <th style={{ backgroundColor: "transparent" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpense.map((expense: Expense) => (
                  <tr key={expense.id}>
                    <td>{expense.name}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.date}</td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleEdit(expense.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleBackButtonClick} className="btn btn-primary">
              {" "}
              Back{" "}
            </button>
          </div>
        )}

        {/* Delete modal */}
        {deleteModalOpen && (
          <div className="delete-modal">
            <h2 className="text-primary text-center">Expense Delete</h2>
            {/* Display fields for details */}
            <div>
              <label className="text-dark">Name</label>
              <input type="text" value={deleteFields.name} disabled />
            </div>
            <div>
              <label className="text-dark">Amount</label>
              <input type="text" value={deleteFields.amount} disabled />
            </div>
            <div>
              <label className="text-dark">Expense-Date</label>
              <input type="text" value={deleteFields.date} disabled />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-danger me-2"
                onClick={handleDeleteLeaveRequest}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                {" "}
                Close{" "}
              </button>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editModalOpen && (
          <div className="delete-modal">
            <h2 className="text-primary text-center">Expense Update</h2>
            <div>
              <label className="text-dark">Name</label>
              <input
                type="text"
                value={editedFields.name}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-dark">Amount</label>
              <input
                type="number"
                value={editedFields.amount}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, amount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-dark">Expense-Date</label>
              <input
                type="text"
                value={editedFields.date}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, date: e.target.value })
                }
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-danger me-2" onClick={handleSave}>
                {" "}
                Save{" "}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditModalOpen(false)}
              >
                {" "}
                Close{" "}
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        className="btn btn-secondary d-flex justify-content-start logout-btn-user"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
}

export default ExpenseForm;
