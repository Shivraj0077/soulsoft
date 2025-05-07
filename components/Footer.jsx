import React from 'react';

const Footer = () => {
  return (
    <div style={styles.footer} className="footer-wrapper">
      {/* Responsive & Logo Visibility Styles */}
      <style jsx>{`
        .footer-logo {
          display: block;
          margin: 0 auto 20px;
          width: 150px !important;
        }

        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .footer-container > div {
            width: 100%;
            min-width: auto;
          }
          .footer-logo {
            display: none !important;
          }
          .footer-section h2 {
            font-size: 1.2rem;
          }
          .footer-section p {
            font-size: 1rem;
          }
          .footer-bottom {
            font-size: 0.9rem;
            margin-top: 20px;
          }
        }
      `}</style>

      <div style={styles.container} className="footer-container">
        {/* Logo */}
        <div style={styles.section} className="footer-section">
          <img src="so.png" className="footer-logo" alt="Soulsoft Logo" />
        </div>

        {/* Get in Touch */}
        <div style={styles.section} className="footer-section">
          <h2 style={styles.heading}>Get In Touch</h2>
          <p style={styles.text}>
            <strong>Office Location:</strong><br />
            S 10-B, 2nd Floor, Top-Ten Imperial, Sangamner 422605, A.Nagar
          </p>
          <p style={styles.text}>
            <strong>Registration Location:</strong><br />
            H-576, Near Bus stand, At post Chandanapur, Sangamner 422605, A.Nagar
          </p>
          <p style={styles.text}>
            <strong>Contact:</strong><br />
            Phone:
            <span>
              +91 9146 79 86 79 /
            </span>
            <br/>
            <span>
              +91 8149 7986 79
            </span>
            <br />
            Email: <span style={{ fontStyle: 'italic' }}>soulsoftinfotech@gmail.com</span>
          </p>

        </div>


        <div style={styles.section} className="footer-section">
          <h2 style={styles.heading}>Company</h2>
          {[
            { name: 'Home', link: '/' },
            { name: 'About Us', link: '/revew' },
            { name: 'POS Products', link: '/products' },

            { name: 'Download', link: '/download' },
            { name: 'Contact', link: '/contact' },
            { name: 'Privacy Policy', link: '/privacy-policy' },
            { name: 'Terms & Conditions', link: '/terms' },
          ].map((item, idx) => (
            <p style={styles.text} key={idx}>
              <a href={item.link} style={{ color: '#fff', textDecoration: 'none' }}>
                {item.name}
              </a>
            </p>
          ))}
        </div>

        {/* Business Hours */}
        <div style={styles.section} className="footer-section">
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

      <div style={styles.bottom} className="footer-bottom">
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
  bottom: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '12px',
    marginTop: '40px',
  },
};

export default Footer;
