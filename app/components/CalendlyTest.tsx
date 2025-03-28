'use client';

import { useEffect } from 'react';

export default function CalendlyTest() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h2>Calendly Test</h2>
      <div 
        className="calendly-inline-widget" 
        data-url={`${process.env.NEXT_PUBLIC_CALENDLY_ORGANIZATION}`}
        style={{ minWidth: '320px', height: '700px' }} 
      />
    </div>
  );
} 