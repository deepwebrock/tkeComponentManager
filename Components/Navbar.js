// RESPONSIVE


'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [engineerName, setEngineerName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('engineerName');

    setLoggedIn(!!token);
    setEngineerName(token ? name : '');
    setMenuOpen(false); // close menu on route change
  }, [pathname]);

  if (pathname === '/login' || !loggedIn) return null;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('engineerName');
    router.push('/login');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white px-4 py-3 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <div className="logo">
        <img className="h-8 w-22" src="logo1.png" alt="Logo" />
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6">
        <NavLink href="/component-entry" label="New Component Entry" />
        <NavLink href="/required-components" label="Required Components" />
        <NavLink href="/deposit-components" label="Deposit Components" />
        <NavLink href="/master" label="Master Page" />
      </div>

      {/* Engineer Name + Logout for Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm">{engineerName}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Hamburger Icon (Mobile & Tablet) */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Menu (Mobile & Tablet) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 flex flex-col gap-4 px-4 py-4 md:hidden shadow-md z-40">
          <NavLink href="/component-entry" label="New Component Entry" />
          <NavLink href="/required-components" label="Required Components" />
          <NavLink href="/deposit-components" label="Deposit Components" />
          <NavLink href="/master" label="Master Page" />
          {/* <span className="text-sm">{engineerName}</span> */}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label }) {
  const router = useRouter();
  const handleClick = () => router.push(href);

  return (
    <button
      onClick={handleClick}
      className="text-left text-sm hover:underline"
    >
      {label}
    </button>
  );
}
