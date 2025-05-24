import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrImage from "../images/qr.png";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    referenceNumber: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleNext = () => {
    if (cart.length === 0) return;
    setStep(2);
  };

  const handleCheckout = async () => {
    const { name, email, phone, referenceNumber } = formData;

    if (!name || !email || !phone || !referenceNumber) {
      setError("Please fill in all the required fields.");
      return;
    }

    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(phone)) {
      setError("Please enter a valid 11-digit phone number.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const order = {
      name,
      items: cart,
      phone,
      email,
      referenceNumber,
      image,
      timestamp: new Date().toLocaleString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const responseData = await response.json();
      if (response.ok) {
        localStorage.setItem("orderDetails", JSON.stringify(order));
        localStorage.removeItem("cart");
        setCart([]);
        setStep(3);
      } else {
        setError(responseData.message || "Failed to place order.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.stepper}>
          <span style={step >= 1 ? styles.activeStep : styles.step}>1</span>
          <div style={styles.line}></div>
          <span style={step >= 2 ? styles.activeStep : styles.step}>2</span>
          <div style={styles.line}></div>
          <span style={step === 3 ? styles.activeStep : styles.step}>3</span>
        </div>

        {step === 1 && (
          <>
            <h2 style={styles.title}>Your Cart</h2>
            {cart.length === 0 ? (
              <p style={styles.emptyCart}>Your cart is empty.</p>
            ) : (
              <>
                <ul style={styles.cartList}>
                  {cart.map((item, index) => (
                    <li key={index} style={styles.cartItem}>
                      <span>{item.name}</span>
                      <div>
                        ₱{item.price}
                        <button onClick={() => removeItem(index)} style={styles.removeBtn}>
                          ✖
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <h3 style={styles.total}>
                  Total: ₱{cart.reduce((sum, item) => sum + item.price, 0)}
                </h3>
                <button onClick={handleNext} style={styles.checkoutBtn}>
                  Next
                </button>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={styles.title}>Enter Your Information</h2>
            <div style={styles.formSection}>
              <div style={styles.formColumn}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="referenceNumber"
                  placeholder="GCash Reference Number"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <label htmlFor="imageUpload" style={styles.uploadLabel}>
                  Upload GCash Screenshot
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  onChange={handleImageChange}
                  style={styles.hiddenInput}
                />
                {image && <p style={styles.imageText}>📎 {image.name}</p>}
                {error && <p style={styles.error}>{error}</p>}
              </div>

              <div style={styles.qrColumn}>
                <h3>GCash QR Code</h3>
                <img src={qrImage} alt="GCash QR" style={styles.qrImage} />
                <p>Scan this to pay</p>
              </div>
            </div>
            <button onClick={handleCheckout} style={styles.checkoutBtn}>
              ✅ Place Order
            </button>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <h2 style={styles.title}>Order Placed Successfully!</h2>
            <p style={styles.successText}>Thank you for your order 🎉</p>

  
            <div style={styles.receiptBox}>-------------------------------------------------- <br/>
              <h3 style={styles.receiptHeader}>Coffee Bliss / Order Receipt</h3>--------------------------------------------------<br/><br/>
              <p><strong>Name:</strong> {formData.name}</p><br/>
              <p><strong>Phone:</strong> {formData.phone}</p><br/>
              <p><strong>Email:</strong> {formData.email}</p><br/>
              <p><strong>GCash Ref #:</strong> {formData.referenceNumber}</p><br/>
              <hr />
              <ul style={{ paddingLeft: "0" }}>
                {JSON.parse(localStorage.getItem("orderDetails"))?.items.map((item, index) => (
                  <li key={index} style={styles.receiptItem}>
                    <span>{item.name}</span>
                    <span>₱{item.price}</span>
                  </li>
                ))}
              </ul>
              <hr />
              <p style={styles.total}>
                <strong>Total:</strong> ₱
                {JSON.parse(localStorage.getItem("orderDetails"))?.items.reduce(
                  (sum, item) => sum + item.price,
                  0
                )}
              </p>
              <p style={styles.timestamp}>
                {new Date().toLocaleString()}
              </p>
            </div>

            <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#fffaf5",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "30px 15px",
    minHeight: "100vh",
  },
  contentWrapper: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px",
  },
  step: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  activeStep: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#6f4f37",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  line: {
    width: "50px",
    height: "3px",
    backgroundColor: "#6f4f37",
    margin: "0 10px",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  successText: {
    color: "green",
    fontSize: "1.2rem",
    marginBottom: "15px",
  },
  emptyCart: {
    fontSize: "1rem",
    color: "#777",
  },
  cartList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "20px",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    padding: "10px 0",
    fontSize: "1rem",
    color: "#333",
  },
  removeBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    fontSize: "1.2rem",
    cursor: "pointer",
    marginLeft: "10px",
  },
  total: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#000",
    margin: "10px 0",
  },
  formSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    marginBottom: "30px",
  },
  formColumn: {
    flex: "1 1 45%",
  },
  qrColumn: {
    flex: "1 1 45%",
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    color: "#333",
  },
  uploadLabel: {
    display: "block",
    backgroundColor: "#eee",
    padding: "10px",
    textAlign: "center",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#6f4f37",
  },
  hiddenInput: {
    display: "none",
  },
  imageText: {
    color: "#444",
    fontSize: "0.9rem",
  },
  error: {
    color: "red",
    fontSize: "1rem",
    marginTop: "10px",
  },
  checkoutBtn: {
    backgroundColor: "#6f4f37",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.2rem",
    cursor: "pointer",
    width: "100%",
  },
  backBtn: {
    backgroundColor: "#6f4f37",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "20px",
  },
  qrImage: {
    width: "250px",
    height: "250px",
    objectFit: "contain",
    margin: "20px auto",
  },
  receiptBox: {
    textAlign: "left",
    backgroundColor: "#fdfdfd",
    border: "1px dashed #ccc",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "400px",
    fontFamily: "monospace",
    color: "#000",
  },
  receiptHeader: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000",
  },
  receiptItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    margin: "4px 0",
    color: "#000",
  },
  timestamp: {
    fontSize: "0.85rem",
    textAlign: "right",
    color: "#000",
    marginTop: "10px",
  },
};

export default Cart;
