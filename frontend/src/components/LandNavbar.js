import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCoffee } from "react-icons/fa";

const LandNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderBottom: "2px solid #c2876d",
        position: "fixed", 
        top: 0,
        left: 0,
        zIndex: 1000,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
      >
        <FaCoffee size={30} color="#fff" />
        <h2 style={{ margin: 0, fontWeight: "bold", color: "#fff" }}>
          Coffee Bliss
        </h2>
      </div>

      <ul
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "14px",
          alignItems: "center",
          listStyleType: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {[ 
          { name: "Home", path: "/home" },
          { name: "About Us", path: "/about" },
          { name: "Contacts", path: "/contacts" },
        ].map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              style={{
                textTransform: "uppercase",
                padding: "8px",
                color: "#fff",
                fontWeight: "500",
                textDecoration: "none",
                borderBottom: "2px solid transparent",
              }}
              onMouseEnter={(e) =>
                (e.target.style.borderBottom = "2px solid #c2876d")
              }
              onMouseLeave={(e) =>
                (e.target.style.borderBottom = "2px solid transparent")
              }
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LandNavbar;
