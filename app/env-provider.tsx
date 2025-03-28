'use client';

import { useEffect } from 'react';

export function EnvProvider() {
  useEffect(() => {
    // Only run on client side and only if window.__ENV__ is not already set
    if (typeof window !== 'undefined' && !window.__ENV__) {
      window.__ENV__ = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_CALENDLY_ORGANIZATION: process.env.NEXT_PUBLIC_CALENDLY_ORGANIZATION,
      };
    }
  }, []);

  return null; // Don't render anything
} 