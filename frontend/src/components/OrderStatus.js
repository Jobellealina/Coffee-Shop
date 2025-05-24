import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => setOrder(data))
      .catch((err) => setError("Failed to fetch order status."));
  }, [orderId]);

  if (error) return <p>{error}</p>;
  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Status</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ₹{order.total}</p>
      <p><strong>Address:</strong> {order.address}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
    </div>
  );
};

export default OrderStatus;
