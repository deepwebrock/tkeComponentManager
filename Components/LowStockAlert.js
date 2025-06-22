'use client';
import { useEffect, useState } from 'react';

export default function LowStockAlert() {
  const [lowStockComponents, setLowStockComponents] = useState([]);

  useEffect(() => {
    const components = JSON.parse(localStorage.getItem('components')) || [];
    const lowStock = components.filter(comp => parseInt(comp.Lqty) <= parseInt(comp.Aqty));
    setLowStockComponents(lowStock);
  }, []);

  if (lowStockComponents.length === 0) return null;

  const message = `⚠️ Alert: Low stock for components - ${lowStockComponents
    .map(c => `${c.name} (Qty: ${c.Lqty})`)
    .join(', ')} ⚠️`;

  return (
    <div className="bg-red-100 text-red-700 font-semibold py-2 px-4 border-b border-red-300 shadow animate-pulse">
      <marquee scrollamount="5">{message}</marquee>
    </div>
  );
}
