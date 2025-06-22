'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoLogout() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      console.log("🟢 User activity - timer reset");
      timer = setTimeout(() => {
        console.log("⏰ Logging out due to inactivity...");
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('engineerName');
        router.push('/login');
      }, 60* 60 * 1000); // 🔁 30 seconds
    };

    // Initial setup
    resetTimer();

    // Attach listeners
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [router]);

  return null;
}
