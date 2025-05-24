import React, { useEffect, useState } from "react";

const mockOrders = [
  {
    id: 1,
    user: "user@example.com",
    products: [{ name: "Product A", price: 100 }, { name: "Product B", price: 150 }],
    total: 250,
    status: "Pending",
    address: "123 Main Street",
    phone: "9876543210",
    paymentMethod: "Credit Card",  
    paymentReference: "XYZ123456",  
  },
  {
    id: 2,
    user: "anotheruser@example.com",
    products: [{ name: "Product C", price: 200 }],
    total: 200,
    status: "Shipped",
    address: "456 Oak Avenue",
    phone: "1234567890",
    paymentMethod: "PayPal",  
    paymentReference: "ABC987654",  
  },
];

const AdminPanel = () => {
  const [orders, setOrders] = useState(mockOrders); 

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div style={styles.container}>
      <h2>Admin Panel: Manage Orders</h2>
      <div>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <h3>Order #{order.id}</h3>
            <p><strong>User:</strong> {order.user}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p> 
            <p><strong>Payment Reference:</strong> {order.paymentReference}</p> 
            <p><strong>Products:</strong></p>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>{product.name} - ₹{product.price}</li>
              ))}
            </ul>
            <div style={styles.statusButtons}>
              <button
                onClick={() => handleUpdateOrderStatus(order.id, "Processing")}
                style={styles.statusButton}
              >
                Mark as Processing
              </button>
              <button
                onClick={() => handleUpdateOrderStatus(order.id, "Shipped")}
                style={styles.statusButton}
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleUpdateOrderStatus(order.id, "Completed")}
                style={styles.statusButton}
              >
                Mark as Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  orderCard: {
    padding: "1rem",
    border: "1px solid #ccc",
    marginBottom: "1rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  statusButtons: {
    display: "flex",
    gap: "1rem",
  },
  statusButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminPanel;
