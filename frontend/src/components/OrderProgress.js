import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LandNavbar from "./LandNavbar";
import coffeeImage from "../images/land.jpg";

const OrderProgress = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch orders when the component is mounted
  useEffect(() => {
    if (!user) {
      navigate("/login"); // If no user, redirect to login
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${user.email}`);
        if (res.data && res.data.length > 0) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center", paddingTop: "2rem" }}>Loading orders...</div>;
  }

  return (
    <div style={styles.page}>
      <img src={coffeeImage} alt="Background" style={styles.backgroundImage} />
      <div style={styles.overlay} />

      <LandNavbar />
      <br />
      <br />
      <br />
      <br />
      <div style={styles.backButtonWrapper}>
        <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        <h1 style={styles.header}>Your Orders</h1>

        {orders.length > 0 ? (
          orders.map((order) => {
            const total = order.items?.reduce((acc, item) => acc + item.price, 0) || 0;

            return (
              <div key={order.orderId} style={styles.orderCard}>
                <div style={styles.orderId}>Order ID: {order.orderId}</div>
                <div style={styles.orderDetails}>
                  <h3 style={styles.sectionTitle}>Items:</h3>
                  <ul style={styles.itemList}>
                    {order.items?.map((item, idx) => (
                      <li key={idx} style={styles.orderItem}>
                        {item.name} — ₱{item.price}
                      </li>
                    ))}
                  </ul>
                  <div style={styles.totalPayment}>Total: ₱{total}</div>
                </div>
                <div style={styles.status}>Status: {order.status}</div>
              </div>
            );
          })
        ) : (
          <div style={styles.noOrders}>No orders found.</div>
        )}

        <footer style={styles.footer}>© 2025 Coffee Bliss. All rights reserved.</footer>
        <ToastContainer />
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    zIndex: -2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: -1,
  },
  backButtonWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    padding: "1rem 2rem 0",
  },
  backButton: {
    backgroundColor: "#6f4f37",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "25px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "background-color 0.3s",
  },
  container: {
    paddingTop: "1rem",
    paddingBottom: "3rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    color: "#fff",
    textAlign: "center",
  },
  header: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "2rem",
  },
  orderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#333",
    borderRadius: "10px",
    padding: "1.5rem",
    margin: "1rem auto",
    maxWidth: "700px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    textAlign: "left",
  },
  orderId: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  orderDetails: {
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  itemList: {
    listStyleType: "none",
    paddingLeft: 0,
    marginBottom: "1rem",
  },
  orderItem: {
    fontSize: "1rem",
    lineHeight: "1.6",
    marginBottom: "0.4rem",
  },
  totalPayment: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#6f4f37",
  },
  status: {
    marginTop: "1rem",
    backgroundColor: "#6f4f37",
    color: "#fff",
    padding: "0.4rem 1rem",
    borderRadius: "5px",
    display: "inline-block",
    fontWeight: "500",
  },
  noOrders: {
    marginTop: "2rem",
    fontSize: "1.2rem",
  },
  footer: {
    marginTop: "3rem",
    color: "#fff",
    fontSize: "14px",
  },
};

export default OrderProgress;
