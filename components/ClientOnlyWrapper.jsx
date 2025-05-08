// src/components/ClientOnlyWrapper.jsx

'use client';

import InlineNavbar from './Navbar';  // Adjust if needed
import Chatbot from './Chatbot';      // Adjust if needed

export default function ClientOnlyWrapper() {
  return (
    <>
      <InlineNavbar />
      <Chatbot />
    </>
  );
}
