import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandNavbar from "./LandNavbar";
import SignUp from "./SignUp";
import Login from "./Login";
import coffeeImage from "../images/land.jpg";

const CoffeeBlissFrontPage = () => {
  const navigate = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div style={styles.page}>
      <img src={coffeeImage} alt="Coffee Background" style={styles.backgroundImage} />
      <div style={styles.overlay} />
      <LandNavbar />

      <div style={styles.heroContent}>
        <h1 style={styles.heading}>Welcome to Coffee Bliss</h1>
        <p style={styles.paragraph}>
          Discover the best coffee blends and indulge in the perfect cup of coffee with us.
          Freshly brewed just for you.
        </p>
        <div style={styles.buttonGroup}>
          <button style={styles.primaryButton} onClick={() => setShowSignUpModal(true)}>
            Sign Up
          </button>
          <button style={styles.primaryButton} onClick={() => setShowLoginModal(true)}>
            Login
          </button>
        </div>
      </div>

      {showSignUpModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setShowSignUpModal(false)}
              style={styles.closeButton}
            >
              ×
            </button>
            <SignUp closeModal={() => setShowSignUpModal(false)} />
          </div>
        </div>
      )}

      {showLoginModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={styles.closeButton}
            >
              ×
            </button>
            <Login closeModal={() => setShowLoginModal(false)} />
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: -1,
  },
  heroContent: {
    height: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 2rem",
    color: "#fff",
  },
  heading: {
    fontSize: "56px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  paragraph: {
    fontSize: "20px",
    maxWidth: "700px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  buttonGroup: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#6f4f37",
    color: "#fff",
    padding: "12px 30px",
    border: "none",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    textTransform: "uppercase",
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
    maxWidth: "500px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
    position: "relative",
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
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    fontSize: "14px",
  },
};

export default CoffeeBlissFrontPage;

