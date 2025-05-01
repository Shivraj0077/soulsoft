import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <>
      <style>
        {`
          @media (max-width: 767px) {
            #compare-wrapper {
              display: none !important;
            }
          }

          @media (min-width: 768px) {
            #compare-wrapper {
              display: flex !important;
            }
          }
        `}
      </style>

      <div
        id="compare-wrapper"
        style={{
          padding: "16px",
          backgroundColor: "black",
          
          display: "flex", // Default visible (in case JS loads before CSS)
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        {/* Text Section */}
        <div
          style={{
            textAlign: "left",
            marginLeft: "114px",
            marginRight: "114px",
            width: "60%",
            backgroundColor: "black",
            padding: "18px",
            marginTop: "20px",
          
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <h2
              style={{
                fontSize: "50px",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "white",
                letterSpacing: "0.025em",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              Every successful product
              <span style={{ color: "#f97316 " }}> starts with a line of code.</span>
            </h2>
            <p
              style={{
                fontSize: "50px",
                fontWeight: 600,
                color: "white",
                lineHeight: 1.5,
              }}
            >
              We write it, shape it, and bring it to life.<br/>
              You dream it. <span style={{ color: "#f97316" }}>We build it.</span>
            </p>
          </div>
        </div>

        {/* Compare Component Section */}
        <div
          style={{
            width: "50%",
            marginLeft: "76px",
            backgroundColor: "black",
            padding: "16px",
           
          }}
        >
          <Compare
            firstImage="https://assets.aceternity.com/code-solution.png"
            secondImage="ec.webp"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            style={{
              height: "900   px",
              width: "900px",
            
            }}
            slideMode="hover"
            autoplay={true}
          />
        </div>
      </div>
    </>
  );
}
