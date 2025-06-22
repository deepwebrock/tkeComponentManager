// RESPONSIVE

'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');

      // ✅ Hide footer on login page OR when no token
      if (pathname === '/login' || !token) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }
    }
  }, [pathname]);

  if (!showFooter) return null;

  return (
    <footer className="w-full overflow-hidden">
      {/* 🔹 Main footer area */}
      <div className="bg-black text-white px-4 py-4 text-sm md:text-base">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          {/* 🔸 Logo block */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <img
              src="logo2.png"
              alt="Logo"
              className="h-18 md:h-20 w-auto object-contain"
            />
          </div>

          {/* 🔸 Text links */}
          <div className="w-full flex flex-wrap justify-center items-center gap-6 text-center">
            <span className="whitespace-nowrap">ELEVATORS</span>
            <span className="whitespace-nowrap">ESCALATORS</span>
            <span className="whitespace-nowrap">MOVING WALKS</span>
            <span className="whitespace-nowrap">SERVICES</span>
            <span className="whitespace-nowrap">MODERNIZATION</span>
          </div>
        </div>
      </div>

      {/* 🔸 Bottom line */}
      <div className="bg-gradient-to-r from-purpleCustom to-orangeCustom">
        <p className="text-center text-black bg-orange-800 py-1 text-sm">
          TK ELEVATOR, ITS DELHI @ 2025
        </p>
      </div>
    </footer>
  );
}



