import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const updatedCart = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1, 
    }));

    setCart(updatedCart);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setEmail(user.email);
      setPhone(user.phone || ""); 
    }
  }, []);

  const handleCheckout = async () => {
    if (!phone || !email) {
      setError("Please fill out phone number and email.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!email) {
      setError("User not logged in.");
      return;
    }

    const order = {
      userId: email,
      items: cart,
      phone,
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        setPhone("");
        setError("");
      } else {
        const data = await response.json();
        console.log("Error Response:", data);
        setError(data.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === itemToRemove.id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.id !== itemToRemove.id || item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div style={styles.container}>
      <h2>Your Cart 🛒</h2>
      {cart.length === 0 ? (
        <p style={styles.emptyMessage}>Cart is empty. Please add some items to your cart!</p>
      ) : (
        <>
          <ul style={styles.cartList}>
            {cart.map((item, index) => (
              <li key={index} style={styles.cartItem}>
                <span>
                  {item.name} - ₹{item.price} x {item.quantity}
                </span>
                <button onClick={() => handleRemoveItem(item)} style={styles.removeButton}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3 style={styles.total}>
            Total: ₹
            {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          </h3>

          <div style={styles.checkoutSection}>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              value={email} 
              readOnly
              style={styles.input}
            />
            {error && <p style={styles.errorMessage}>{error}</p>}
            <button onClick={handleCheckout} style={styles.checkoutButton}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  emptyMessage: {
    fontSize: "1.2rem",
    color: "#555",
  },
  cartList: {
    listStyleType: "none",
    paddingLeft: 0,
  },
  cartItem: {
    fontSize: "1rem",
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "1rem",
  },
  checkoutButton: {
    padding: "0.7rem 1.5rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  removeButton: {
    padding: "0.3rem 0.7rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  input: {
    display: "block",
    margin: "1rem 0",
    padding: "0.5rem",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  checkoutSection: {
    marginTop: "1rem",
  },
  errorMessage: {
    color: "red",
    fontSize: "1rem",
  },
};

export default Cart;
