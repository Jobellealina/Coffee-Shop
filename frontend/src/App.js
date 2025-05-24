import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Cart from "./components/Cart";
import OrderProgress from "./components/OrderProgress";
import AdminOrders from "./components/AdminOrders";
import CoffeeBlissFrontPage from "./components/CoffeeBlissFrontPage";
import AboutPage from "./components/pages/AboutPage";
import ContactsPage from "./components/pages/ContactsPage";
import LandNavbar from "./components/LandNavbar";

const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

const isAdminAuthenticated = () => {
  return !!localStorage.getItem("admin");
};

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleModal = (modalType) => {
    if (modalType === "signup") {
      setShowLogin(false);
      setShowSignUp(true);
    } else if (modalType === "login") {
      setShowSignUp(false);
      setShowLogin(true);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/bg.webp')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<CoffeeBlissFrontPage toggleModal={toggleModal} />} />
          <Route path="/about" element={<PageWithNavbar><AboutPage /></PageWithNavbar>} />
          <Route path="/contacts" element={<PageWithNavbar><ContactsPage /></PageWithNavbar>} />

          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="/cart"
            element={isAuthenticated() ? <Cart /> : <Navigate to="/" replace />}
          />
          <Route
            path="/order-progress"
            element={isAuthenticated() ? <OrderProgress /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/orders"
            element={isAdminAuthenticated() ? <AdminOrders /> : <Navigate to="/admin/login" replace />}
          />
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {showLogin && (
          <div className="modal" onClick={() => setShowLogin(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <Login closeModal={() => setShowLogin(false)} toggleModal={toggleModal} />
              <div><button onClick={() => toggleModal("signup")}>Register</button></div>
            </div>
          </div>
        )}
        {showSignUp && (
          <div className="modal" onClick={() => setShowSignUp(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <SignUp closeModal={() => setShowSignUp(false)} toggleModal={toggleModal} />
              <div><button onClick={() => toggleModal("login")}>Back to Login</button></div>
            </div>
          </div>
        )}
      </Router>
    </div>
  );
}

const PageWithNavbar = ({ children }) => (
  <>
    <LandNavbar />
    <div style={{ paddingTop: "80px" }}>{children}</div>
  </>
);

export default App;
