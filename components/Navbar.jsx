"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const AnimatedBlackNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure the component is rendered on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="so.png" alt="Logo" className="logo" />
      </div>

      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Render menu only after the component is mounted on the client */}
      {isClient && (
        <div className={`links ${menuOpen ? "open" : ""}`}>
          <a href="/">Home</a>
          <a href="/revew">About</a>
          <Link href="/#services" scroll={false}>
  Services
</Link>
          <a href="/contact">Contact</a>
          <a href="/career">Career</a>
          <a href="/products">Products</a>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: relative;
          width: 100%;
          background: #000;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
        }

        .logo {
          height: 60px;
          width: auto;
        }

        .links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .links a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          position: relative;
        }

        .links a::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2px;
          background: #fff;
          transition: width 0.3s ease;
        }

        .links a:hover::after {
          width: 100%;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 18px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hamburger span {
          display: block;
          width: 100%;
          height: 3px;
          background: #fff;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: #000;
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.4s ease;
          }

          .links.open {
            max-height: 300px; /* enough to show all links */
          }

          .links a {
            padding: 1rem 2rem;
            width: 100%;
            box-sizing: border-box;
            border-top: 1px solid #222;
          }
        }
      `}</style>
    </nav>
  );
};

export default AnimatedBlackNavbar;
