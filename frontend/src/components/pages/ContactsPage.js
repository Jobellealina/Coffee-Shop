import React from "react";
import bgImage from "../../images/land.jpg"; 

const ContactsPage = () => {
  return (
    <div style={styles.page}>
      <img src={bgImage} alt="Coffee Bliss" style={styles.backgroundImage} />
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1 style={styles.heading}>Contact Us</h1>

        <div style={styles.infoSection}>
          <div style={styles.infoBlock}>
            <h2 style={styles.subheading}>📍 Visit Us</h2>
            <p style={styles.text}>
              Coffee Bliss Café<br />
              123 Bean Street, Brewtown, PH 1010
            </p>
          </div>

          <div style={styles.infoBlock}>
            <h2 style={styles.subheading}>🕒 Operating Hours</h2>
            <p style={styles.text}>
              Monday – Friday: 7:00 AM – 9:00 PM<br />
              Saturday – Sunday: 8:00 AM – 10:00 PM
            </p>
          </div>

          <div style={styles.infoBlock}>
            <h2 style={styles.subheading}>💬 Get in Touch With Us</h2>
            <p style={styles.text}>
              Our team is always happy to assist! If you have any questions about our menu, events, or services,
              don’t hesitate to send us an email or message us on our social platforms.
            </p>
            <p style={styles.text}>
              📧 <strong>Email:</strong> coffee@bliss.com<br />
              📱 <strong>Phone:</strong> +63 912 345 6789<br />
              🌐 <strong>Facebook:</strong> <a href="https://facebook.com/coffee.bliss" style={styles.link}>facebook.com/coffee.bliss</a><br />
              📸 <strong>Instagram:</strong> <a href="https://instagram.com/coffee.bliss" style={styles.link}>@coffee.bliss</a>
            </p>
            <p style={styles.text}>
              We typically respond within 24 hours. Looking forward to connecting with you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
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
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: -1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
    color: "#fff",
    textAlign: "center",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1.1rem",
    maxWidth: "700px",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    marginTop: "30px",
    width: "100%",
    maxWidth: "800px",
  },
  infoBlock: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    backdropFilter: "blur(4px)",
  },
  link: {
    color: "#ffd8b1",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default ContactsPage;
