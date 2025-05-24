import React from "react";
import bgImage from "../../images/land.jpg";

const AboutPage = () => {
  return (
    <div style={styles.page}>
      <img src={bgImage} alt="Coffee Bliss" style={styles.backgroundImage} />
      <div style={styles.overlay} />

      <div style={styles.contentWrapper}>
        <div style={styles.heroContent}>
          <h1 style={styles.heading}>About Coffee Bliss</h1><br/><br/>
          <p style={styles.paragraph}>
            Coffee Bliss is more than just a coffee shop – it's your cozy corner of comfort,
            caffeine, and community. We source only the finest beans from around the world and
            craft every cup with love, care, and a touch of magic.
          </p><br/><br/><br/>
          <p style={styles.paragraph}>
            Whether you're looking to start your day with the perfect espresso or wind down with a warm latte,
            our passionate baristas are here to serve joy in a cup. Experience the warmth of great coffee, friendly
            faces, and a space where stories are shared and memories are brewed.
          </p>
        </div>

        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <p style={styles.footerText}>
              &copy; {new Date().getFullYear()} <strong>Coffee Bliss</strong> &bull; All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  backgroundImage: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -2,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: -1,
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  heroContent: {
    marginTop: "80px", 
    textAlign: "center",
    color: "#fff",
    padding: "0 20px",
    maxWidth: "700px",
    alignSelf: "center",
  },
  heading: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  paragraph: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  footer: {
    textAlign: "center",
    padding: "0.8rem 0",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    fontSize: "14px",
    marginTop: "auto",
  },
  footerInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  footerText: {
    marginBottom: "8px",
  },
  footerLinks: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#f1f1f1",
    textDecoration: "none",
    transition: "color 0.3s",
  },
};

export default AboutPage;
