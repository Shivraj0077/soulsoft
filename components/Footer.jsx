import React from 'react';

const Footer = () => {
  return (
    <div style={styles.footer}>
      <style>
        {`
          @media (max-width: 768px) {
            .footer-container {
              flex-direction: column;
              align-items: flex-start;
              gap: 30px;
            }
          }
        `}
      </style>

      <div style={styles.container} className="footer-container">

        {/* Logo and About */}
        <div style={styles.section}>
          <img src="so.png" style={styles.logo} />
          
        </div>

        {/* Get in Touch */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Get In Touch</h2>
          <p style={styles.text}>
            <strong>Office Location</strong><br />
            S 10-D, 2nd Floor, Top-Ten Imperial, Sanganer, A-2605, A.Nagar
          </p>
          <p style={styles.text}>
            <strong>Registration Location</strong><br />
            H-576, Near Bus stand, At post Chandanapur, Sanganer, 422605, A.Nagar
          </p>
          <p style={styles.text}>
            <strong>Contact</strong><br />
            Phone: +91 9146 79 86 79 / +91 9149 7986 79<br />
            Email: soulsoftinfotech@gmail.com
          </p>
        </div>

        {/* Company */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Company</h2>
          <p style={styles.text}>Home</p>
          <p style={styles.text}>About Us</p>
          <p style={styles.text}>POS Products</p>
          <p style={styles.text}>Services</p>
          <p style={styles.text}>Download</p>
          <p style={styles.text}>Contact</p>
          <p style={styles.text}>Privacy Policy</p>
          <p style={styles.text}>Terms & Conditions</p>
        </div>

        {/* Business Hours */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Business Hours</h2>
          <p style={styles.text}>
            <strong>Opening Days</strong><br />
            Monday - Friday: 9 am to 6 pm
          </p>
          <p style={styles.text}>
            <strong>Closing Days</strong><br />
            Saturday - Sunday Closed
          </p>
        </div>
      </div>

      <div style={styles.bottom}>
        ©2025 Soulsoft Infotech Pvt. Ltd. All Rights Reserved.
      </div>
    </div>
  );
};

const styles = {
  footer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '40px 20px',
    marginTop: 'auto',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '40px',
  },
  section: {
    flex: '1 1 220px',
    minWidth: '220px',
  },
  heading: {
    fontSize: '17px',
    marginBottom: '12px',
    borderBottom: '2px solid #3b82f6',
    display: 'inline-block',
    paddingBottom: '4px',
  },
  text: {
    fontSize: '17px',
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  logo: {
    width: '200px',
    marginBottom: '-13px',
  },
  bottom: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '12px',
    marginTop: '40px',
  },
};

export default Footer;
