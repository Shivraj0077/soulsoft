// components/VerticalArrow.jsx
import React from 'react';

const VerticalArrow = ({ height = 300, width = 40, color = "#000000" }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2">
      <svg 
        viewBox="0 0 40 300" 
        width={width} 
        height={height} 
        fill={color}
      >
        <path d="M20 0 L20 270 L5 255 L20 300 L35 255 L20 270" />
      </svg>
    </div>
  );
};

export default VerticalArrow;