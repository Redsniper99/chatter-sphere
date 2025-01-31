// /app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page on initial load
    router.push('/auth/login');
  }, [router]);

  return null; // Since we're redirecting, no content is needed here
}
