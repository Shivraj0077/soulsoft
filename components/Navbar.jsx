"use client";
import { useState } from "react";

export default function InlineNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: black;
          color: white;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
        }

        .logo img {
          height: 40px; /* Adjust the height of the logo */
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
        }

        .menu-icon {
          display: none;
          font-size: 1.8rem;
          cursor: pointer;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .menu-icon {
            display: block;
          }

          .mobile-menu.open {
            display: flex;
            flex-direction: column;
            background-color: black;
            padding: 2rem;
            position: fixed;
            top: 60px;
            left: 0;
            width: 100%;
            height: calc(100vh - 60px);
            z-index: 9999;
          }

          .mobile-menu a {
            color: white;
            text-decoration: none;
            margin-bottom: 20px;
            font-size: 1.2rem;
          }
          
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">
          <a href="/">
            <img src="/so.png" alt="Soulsoft Logo" />
          </a>
    
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/revew">About</a>
          <a href="contactus">Contact</a>
          <a href="/products">Products</a>
          <a href="/jobs">Career</a>
          <a href="/tickets">Raise a Ticket</a>
        </div>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="/">Home</a>
        <a href="/revew">About</a>
        <a href="/contactus">Contact</a>
        <a href="/products">Products</a>
        <a href="/jobs">Career</a>
        <a href="/tickets">Raise a Ticket</a>
      </div>
    </>
  );
}
