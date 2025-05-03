"use client";

import React from "react";
import styles from "./WobbleCardDemo.module.css";

export function WobbleCardDemo() {
  return (
    <div className={styles.container}>
      <div className={`${styles.wobbleCard} ${styles.card1}`}>
        <div className={styles.content}>
          <h2>Gippity AI powers the entire universe</h2>
          <p>
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          alt="linear demo image"
          className={styles.card1Image}
        />
      </div>
      <div className={`${styles.wobbleCard} ${styles.card2}`}>
        <div className={styles.content}>
          <h2>No shirt, no shoes, no weapons.</h2>
          <p>
            If someone yells “stop!”, goes limp, or taps out, the fight is over.
          </p>
        </div>
      </div>
      <div className={`${styles.wobbleCard} ${styles.card3}`}>
        <div className={styles.content}>
          <h2>
            Signup for blazing-fast cutting-edge state of the art Gippity AI
            wrapper today!
          </h2>
          <p>
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          alt="linear demo image"
          className={styles.card3Image}
        />
      </div>
    </div>
  );
}