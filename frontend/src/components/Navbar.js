import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCoffee } from "react-icons/fa";

const Navbar = ({ cart, onProfileClick, user }) => {
  const navigate = useNavigate();

  const userData = user || JSON.parse(localStorage.getItem("user"));
  
  const userName = userData?.fullName || "Guest"; 
  const userProfilePic = userData?.profilePicture;

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <FaCoffee size={28} color="#fff" />
        <h2 style={styles.logoText}>Coffee Bliss</h2>
      </div>

      <div style={styles.rightMenu}>
        <div style={styles.cart} onClick={() => navigate("/cart")}>
          🛒 Cart
          {cart.length > 0 && (
            <span style={styles.cartBadge}>{cart.length}</span>
          )}
        </div>

        {userData ? (
          <div
            style={styles.profile}
            onClick={onProfileClick}
            title="View Profile"
          >
            {userProfilePic ? (
              <img
                src={userProfilePic}
                alt="Profile"
                style={styles.profilePic}
              />
            ) : (
              <FaUserCircle size={24} color="#fff" />
            )}
            <span style={styles.profileName}>{userName}</span>
          </div>
        ) : (
          <div
            onClick={() => navigate("/login")}
            style={styles.loginButton}
            title="Login"
          >
            Login
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    width: "100%",
    height: "70px",
    padding: "0 2rem",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    zIndex: 999,
    backdropFilter: "blur(6px)",
    fontFamily: "'Poppins', sans-serif",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoText: {
    margin: 0,
    fontWeight: "bold",
    color: "#fff",
    fontSize: "20px",
  },
  rightMenu: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    color: "#fff",
  },
  cart: {
    cursor: "pointer",
    position: "relative",
    color: "#fff",
    fontWeight: 500,
    fontSize: "14px",
  },
  cartBadge: {
    position: "absolute",
    top: "-8px",
    right: "-12px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: "#fff",
  },
  profilePic: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  profileName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
  },
  loginButton: {
    cursor: "pointer",
    color: "#fff",
    fontWeight: 500,
    fontSize: "14px",
    padding: "5px 15px",
    borderRadius: "20px",
    backgroundColor: "#FFB84D",
    border: "none",
  },
};

export default Navbar;
