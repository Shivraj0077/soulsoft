import React from "react";

const LineSlides = () => {

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    height: "100vh",
    backgroundColor: "#f4eee8",
  };

  const itemStyle = {
    padding: "20px",
    fontWeight: "bold",
    borderRight: "1px solid #999",
    textAlign: "center",
    minWidth: "100px",
  };

  const lastItemStyle = { ...itemStyle, borderRight: "none" };

  return (
    <div style={containerStyle}>
      <div style={itemStyle}>Slide 1<br />Description 1</div>
      <div style={itemStyle}>Slide 2<br />Description 2</div>
      <div style={itemStyle}>Slide 3<br />Description 3</div>
      <div style={lastItemStyle}>Slide 4<br />Description 4</div>
    </div>
  );
};

export default LineSlides;
