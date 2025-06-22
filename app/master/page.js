// RESPONSIVE

'use client';
import { useEffect, useState } from 'react';
import LowStockAlert from '@/Components/LowStockAlert';

export default function MasterPage() {
  const [masterRecords, setMasterRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('');

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('masterRecords')) || [];
    setMasterRecords(records.reverse());
  }, []);

  const filteredRecords = masterRecords.filter((record) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    switch (filterColumn) {
      case 'type':
        return record.type?.toLowerCase().includes(term);
      case 'name':
        return record.name?.toLowerCase().includes(term);
      case 'Engn':
        return record.Engn?.toLowerCase().includes(term);
      case 'gmds':
        return String(record.gmds).toLowerCase().includes(term);
      default:
        return (
          record.name?.toLowerCase().includes(term) ||
          record.type?.toLowerCase().includes(term) ||
          record.Engn?.toLowerCase().includes(term) ||
          String(record.gmds).toLowerCase().includes(term)
        );
    }
  });

  return (
    <>
      <div className='pt-14'><LowStockAlert /></div>

      <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Master Log</h1>

        {/* Search Input */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by Type, Component, GMDS or Engineer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {/* Optional Dropdown (Uncomment if you want it again) */}
          {/* 
          <select
            className="border p-2 rounded w-full sm:w-1/4"
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
          >
            <option value="">All Columns</option>
            <option value="type">Type</option>
            <option value="name">Component Name</option>
            <option value="Engn">Engineer Name</option>
            <option value="gmds">GMDS Code</option>
          </select>
          */}
        </div>

        {filteredRecords.length === 0 ? (
          <p className="text-gray-500">No activity found.</p>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto rounded border">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="sticky top-0 bg-gray-200 z-10">
                <tr>
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Component Name</th>
                  <th className="p-2 border">GMDS Code</th>
                  <th className="p-2 border text-center">Deposit /<br />Required Qty</th>
                  <th className="p-2 border">Live Qty</th>
                  <th className="p-2 border">Alert Qty</th>
                  <th className="p-2 border">Location</th>
                  <th className="p-2 border">Engineer</th>
                  <th className="p-2 border">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((log, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-2 border">{filteredRecords.length - idx}</td>
                    <td className="p-2 border font-semibold">{log.type}</td>
                    <td className="p-2 border">{log.name}</td>
                    <td className="p-2 border">{log.gmds}</td>
                    <td className="p-2 border text-center">{log.qty || '-'}</td>
                    <td className="p-2 border">{log.Lqty || '-'}</td>
                    <td className="p-2 border">{log.Aqty || '-'}</td>
                    <td className="p-2 border">{log.location}</td>
                    <td className="p-2 border">{log.Engn}</td>
                    <td className="p-2 border text-gray-600 text-xs">{log.dateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}