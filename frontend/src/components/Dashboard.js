import React, { useState, useEffect } from "react";
import products from "./products";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import coffeeImage from "../images/land.jpg";

const Dashboard = () => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filter, setFilter] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${product.name} has been added to your cart!`);
  };

  const handleFilterChange = (category) => {
    setFilter(category);
    if (category === "drinks") {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.category === "coffee" || product.category === "smoothies"
        )
      );
    } else if (category === "cupcakes") {
      setFilteredProducts(
        products.filter((product) => product.category === "cupcakes")
      );
    } else if (category === "pastries") {
      setFilteredProducts(
        products.filter((product) => product.category === "pastries")
      );
    } else if (category === "sandwiches") {
      setFilteredProducts(
        products.filter((product) => product.category === "sandwiches")
      );
    } else {
      setFilteredProducts(products);
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (!user) {
      setError("You need to be logged in to view orders.");
      return;
    }

    const fetchOrders = () => {
      axios
        .get(`http://localhost:5000/api/orders/${user.email}`)
        .then((res) => setOrders(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || "Failed to fetch orders.")
        );
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/landing");
  };

  return (
    <div style={styles.page}>
      <img src={coffeeImage} alt="Background" style={styles.backgroundImage} />
      <div style={styles.overlay} />

      <Navbar cart={cart} onProfileClick={() => setShowProfile(true)} user={user} /><br />

      <div style={styles.content}>
        <div style={styles.filterBar}>
          <button onClick={() => handleFilterChange("")} style={styles.primaryButton}>All</button>
          <button onClick={() => handleFilterChange("drinks")} style={styles.primaryButton}>Drinks</button>
          <button onClick={() => handleFilterChange("cupcakes")} style={styles.primaryButton}>Cupcakes</button>
          <button onClick={() => handleFilterChange("pastries")} style={styles.primaryButton}>Pastries</button>
          <button onClick={() => handleFilterChange("sandwiches")} style={styles.primaryButton}>Sandwiches</button>
        </div>
        <br />
        <div style={styles.productGrid}>
          {filteredProducts?.map((item) => (
            <div style={styles.productCard} key={item.id}>
              <img src={item.image} alt={item.name} style={styles.productImage} />
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{item.name}</h3>
                <p style={styles.productPrice}>₱{item.price}</p>
                <button onClick={() => addToCart(item)} style={styles.primaryButton}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />

      {showProfile && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowProfile(false)} style={styles.closeButton}>×</button>
            <h3 style={{ color: "#6f4f37", marginBottom: "1rem" }}>User Profile</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <br />
            <button onClick={() => {
              setShowProfile(false);
              navigate("/order-progress");
            }} style={styles.primaryButton}>
              View Order
            </button>
            <br />
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
        </div>
      )}

      <footer style={styles.footer}>© 2025 Coffee Bliss. All rights reserved.</footer>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    overflowX: "hidden",
    overflowY: "auto",
  },
  backgroundImage: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    zIndex: -2,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: -1,
  },
  content: {
    padding: "2rem",
    paddingTop: "6rem",
    color: "#fff",
    textAlign: "center",
  },
  filterBar: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#6f4f37",
    color: "#fff",
    padding: "12px 30px",
    border: "none",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "12px 30px",
    border: "none",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  productGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
  },
  productCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    width: "260px",
    textAlign: "center",
    color: "#333",
    marginTop: "40px",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  productInfo: {
    marginTop: "1rem",
  },
  productName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  productPrice: {
    fontSize: "16px",
    marginBottom: "1rem",
    color: "#6f4f37",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
    position: "relative",
    textAlign: "center",
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    color: "#6f4f37",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    padding: "1rem 0",
    color: "#fff",
    fontSize: "14px",
    position: "relative",
    bottom: 0,
    marginTop: "4rem",
  },
};

export default Dashboard;
