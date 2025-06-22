// RESPONSIVE PAGE-

// RESPONSIVE PAGE-

'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '../data/users'; // Adjust path if needed

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault(); // 🔸 Prevent page reload on submit

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('authToken', 'valid');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('engineerName', user.name);
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => router.push('/component-entry'), 1500);
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* 🔹 Background Image */}
      <Image
        src="/background2.png"
        alt="Login background"
        fill
        className="object-cover brightness-75"
        priority
      />

      {/* 🔸 Login Form Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[rgba(226,127,91,0.1)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-11/12 max-w-sm md:max-w-md text-white border border-white/20">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-1 sm:mb-2">TKE Component Manager</h1>
          <p className="text-xs sm:text-sm text-center text-gray-200 mb-4 sm:mb-6">Precision in Every Move</p>

          {successMsg && (
            <div className="mb-4 text-green-300 text-center text-sm">{successMsg}</div>
          )}

          {/* ✅ Wrap inputs and button in a form */}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 sm:p-3 mb-4 bg-white bg-opacity-20 rounded placeholder-black text-black outline-none text-sm sm:text-base"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 sm:p-3 mb-6 bg-white bg-opacity-20 rounded placeholder-black text-black outline-none text-sm sm:text-base"
              required
            />

            <button
              type="submit" // 🔸 Important
              className="w-full bg-[rgba(244,241,240,0.1)] hover:bg-orange-600 transition py-2 rounded font-semibold text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

