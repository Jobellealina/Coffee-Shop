import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaChartBar,
  FaClipboardList,
  FaSpinner,
  FaCheckCircle,
  FaBoxOpen,
  FaTasks,
  FaArrowLeft,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const styles = {
  container: {
    display: "flex",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f4f7fa",
    minHeight: "100vh",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#4E3629",
    padding: "1rem",
    color: "white",
    height: "100vh",
    position: "sticky",
    top: 0,
  },
  tabButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1rem",
    margin: "1rem 0",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px 15px",
  },
  tabButtonHover: {
    backgroundColor: "#3b2e1d",
  },
  content: {
    flex: 1,
    padding: "2rem",
    color: "black",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
  },
  summaryBox: {
    flex: "1",
    minWidth: "150px",
    backgroundColor: "#dcdde1",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
  },
  card: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  graphContainer: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "10px",
    marginTop: "2rem",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#4E3629",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    marginBottom: "1rem",
    cursor: "pointer",
    fontSize: "1rem",
    border: "none",
  },
  backButtonIcon: {
    marginRight: "8px",
  },
  orderButtonsContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "1rem",
  },
  orderButton: {
    backgroundColor: "#4E3629",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  orderButtonHover: {
    backgroundColor: "#3b2e1d",
  },
  orderDetails: {
    marginBottom: "0.5rem",
  },
  itemList: {
    paddingLeft: "1rem",
    listStyleType: "none",
  },
  item: {
    marginBottom: "0.5rem",
  },
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStatus, setSelectedStatus] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders");
      const formatted = res.data.map((order) => ({
        ...order,
        items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
      }));
      setOrders(formatted);
    } catch (err) {
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const countByStatus = (status) => orders.filter((o) => o.status === status).length;

  const filteredOrders = selectedStatus
    ? orders.filter((order) => order.status === selectedStatus)
    : orders;

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order ${orderId} marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(ordersByDate).map(([date, count]) => ({
    date,
    orders: count,
  }));

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3> CB Admin Panel</h3><br/><br/><br/><br/>
        <button
          style={styles.tabButton}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaChartBar style={{ marginRight: 8 }} /> Dashboard
        </button>
        <button
          style={styles.tabButton}
          onClick={() => setActiveTab("orders")}
        >
          <FaClipboardList style={{ marginRight: 8 }} /> Orders
        </button>
      </div>

      <div style={styles.content}>
        {activeTab !== "dashboard" && (
          <button
            style={styles.backButton}
            onClick={() => {
              setActiveTab("dashboard");
              setSelectedStatus(null);
            }}
          >
            <FaArrowLeft style={styles.backButtonIcon} />
            Back to Dashboard
          </button>
        )}

        <div style={styles.header}>
          {activeTab === "dashboard" ? "Dashboard" : "Orders"}
        </div>

        {activeTab === "dashboard" && (
          <>
            <div style={styles.summaryRow}>
              {[ 
                {
                  title: "Total Orders",
                  count: orders.length,
                  status: null,
                  icon: <FaTasks />,
                },
                {
                  title: "Preparing",
                  count: countByStatus("Preparing"),
                  status: "Preparing",
                  icon: <FaSpinner />,
                },
                {
                  title: "Ready",
                  count: countByStatus("Ready for Pickup"),
                  status: "Ready for Pickup",
                  icon: <FaBoxOpen />,
                },
                {
                  title: "Completed",
                  count: countByStatus("Completed"),
                  status: "Completed",
                  icon: <FaCheckCircle />,
                },
              ].map(({ title, count, status, icon }) => (
                <div
                  key={title}
                  style={styles.summaryBox}
                  onClick={() => {
                    setActiveTab("orders");
                    setSelectedStatus(status);
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                    {icon}
                  </div>
                  <h3>{title}</h3>
                  <p>{count}</p>
                </div>
              ))}
            </div>

            <div style={styles.graphContainer}>
              <h3>Orders Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="orders" stroke="#4E3629" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "orders" &&
          filteredOrders.map((order) => {
            const total =
              order.items?.reduce((acc, item) => acc + item.price, 0) || 0;
            return (
              <div key={order.orderId} style={styles.card}>
                <h4>Order ID: {order.orderId}</h4>
                <br />
                <p style={styles.orderDetails}>
                  <strong>Email:</strong> {order.email}
                </p>
                <p style={styles.orderDetails}>
                  <strong>Phone:</strong> {order.phone}
                </p>
                <p style={styles.orderDetails}>
                  <strong>Items:</strong>
                </p><br/>
                <ul style={styles.itemList}>
                  {order.items.map((item, idx) => (
                    <li key={idx} style={styles.item}>
                      {item.name} - ₱{item.price}
                    </li>
                  ))}
                </ul>
                <br />
                <p style={styles.orderDetails}>
                  <strong>Total Payment:</strong> ₱{total}
                </p>
                <p style={styles.orderDetails}>
                  <strong>Payment:</strong> Paid via GCash
                </p>
                <p style={styles.orderDetails}>
                  <strong>GCash Ref. #:</strong> {order.paymentReference}
                </p>
                <div style={styles.orderButtonsContainer}>
                  {order.status !== "Completed" && (
                    <>
                      <button
                        style={styles.orderButton}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor =
                            styles.orderButtonHover.backgroundColor)
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#4E3629")
                        }
                        onClick={() =>
                          updateOrderStatus(order.orderId, "Preparing")
                        }
                      >
                        Preparing
                      </button>
                      <button
                        style={styles.orderButton}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor =
                            styles.orderButtonHover.backgroundColor)
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#4E3629")
                        }
                        onClick={() =>
                          updateOrderStatus(order.orderId, "Ready for Pickup")
                        }
                      >
                        Ready
                      </button>
                      <button
                        style={styles.orderButton}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor =
                            styles.orderButtonHover.backgroundColor)
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#4E3629")
                        }
                        onClick={() =>
                          updateOrderStatus(order.orderId, "Completed")
                        }
                      >
                        Complete
                      </button>
                    </>
                  )}
                </div>
                <br />
                <p style={styles.orderDetails}>
                  <strong>Status:</strong> {order.status}
                </p>
              </div>
            );
          })}

        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminDashboard;
