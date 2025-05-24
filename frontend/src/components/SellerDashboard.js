import React, { useState, useEffect } from "react";

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((err) => setError("Failed to fetch orders."));
  }, []);

  const handleUpdateStatus = (orderId, status) => {
    fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((updatedOrder) => {
        setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      })
      .catch((err) => setError("Failed to update order status."));
  };

  return (
    <div>
      <h2>Seller Dashboard</h2>
      {error && <p>{error}</p>}
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <button onClick={() => handleUpdateStatus(order.id, "In Progress")}>Mark as In Progress</button>
            <button onClick={() => handleUpdateStatus(order.id, "Shipped")}>Mark as Shipped</button>
            <button onClick={() => handleUpdateStatus(order.id, "Delivered")}>Mark as Delivered</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDashboard;
