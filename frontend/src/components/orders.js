import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user");

    if (!userId) {
      setError("You need to be logged in to view your orders.");
      return;
    }

    const fetchOrders = () => {
      axios
        .get(`http://localhost:5000/api/orders/${userId}`)
        .then((res) => setOrders(res.data))
        .catch((err) =>
          setError(
            err.response ? err.response.data.message : "Failed to fetch orders."
          )
        );
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return "orange";
      case "ready for pickup":
        return "green";
      case "completed":
        return "gray";
      default:
        return "blue";
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Orders</h2>
      {error && <p>{error}</p>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {orders.map((order) => (
              <li key={order.orderId} style={{ marginBottom: "1rem" }}>
                <h4>Order #{order.orderId}</h4>
                <p>Status: <span style={{ color: getStatusColor(order.status) }}>{order.status}</span></p>
                <p>Items:</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - ₹{item.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/")} style={{ marginTop: "10px" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Orders;
