"use client";
import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0,
      mouseY = 0;
    let currentX = 0,
      currentY = 0;
    const speed = 0.1;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const checkElementHover = () => {
      let hovering = false;

      // Get all navbar elements
      const navbarElements = document.querySelectorAll(
        ".navbar, .nav-links a, .logo, .menu-icon, .mobile-menu.open"
      );

      // Get chatbot elements (including the main chatbot container)
      const chatbotElements = document.querySelectorAll(
        ".soulsoft-chatbot, .soulsoft-chatbot button, .soulsoft-chatbot *"
      );

      // Check navbar elements
      navbarElements.forEach((element) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
          ) {
            hovering = true;
            console.log("Hovering over navbar element:", element);
          }
        }
      });

      // Check chatbot elements
      chatbotElements.forEach((element) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
          ) {
            hovering = true;
            console.log("Hovering over chatbot element:", element);
          }
        }
      });

      // Optional: Keep the bottom-right corner check for redundancy
      const bottomRightElements = Array.from(
        document.querySelectorAll(".soulsoft-chatbot, .soulsoft-chatbot *")
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        const rightSide = window.innerWidth - rect.right < 100;
        const bottomSide = window.innerHeight - rect.bottom < 100;
        return rightSide && bottomSide;
      });

      bottomRightElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        ) {
          hovering = true;
          console.log("Hovering over bottom-right chatbot element:", element);
        }
      });

      setIsVisible(!hovering);
    };

    const animate = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      if (cursor) {
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
      }

      checkElementHover();
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <span>SCALE YOUR BUSINESS</span>
      </div>

      <style jsx>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          font-size: 13px;
          color: black;
          text-align: center;
          font-weight: bold;
          transition: opacity 0.2s ease;
        }

        @media (pointer: coarse) {
          .custom-cursor {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;