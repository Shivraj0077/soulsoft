'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Separate component that uses hooks
function ScrollToHashContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        // Delay to ensure DOM is rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

// Main component with Suspense boundary
export default function ScrollToHash() {
  return (
    <Suspense fallback={null}>
      <ScrollToHashContent />
    </Suspense>
  );
}