// components/CustomCursor.jsx
import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const speed = 0.1;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      if (cursor) {
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
      }

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
      <div ref={cursorRef} className="custom-cursor">
        <span>SCALE YOUR BUSSINESS</span>
      </div>

      {/* Scoped styling inside component */}
      <style jsx>{`
  .custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: rgba(240, 63, 63, 0.9); /* Semi-transparent background */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25); /* Shadow for depth */
  border-radius: 50%; /* Perfect circle */
  transform: translate(-50%, -50%); /* Only centering, no rotation */
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font-size: 13px;
  color: white;
    text-align: center;
  font-weight: bold;
}

`}
</style>

    </>
  );
};

export default CustomCursor;
