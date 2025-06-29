

// RESPONSIVE

'use client';
import { useEffect, useState } from 'react';
import LowStockAlert from '@/Components/LowStockAlert';


export default function MasterPage() {
  const [masterRecords, setMasterRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState({
    type: '',
    name: '',
    gmds: '',
    qty: '',
    Lqty: '',
    Aqty: '',
    location: '',
    Engineer: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, columnFilters]);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('masterRecords')) || [];

    // Format dateTime to dd/mm/yyyy, HH:mm:ss without AM/PM
    const formattedRecords = records.map((record) => {
      if (record.dateTime && record.dateTime.includes('AM') || record.dateTime.includes('PM')) {
        const dateObj = new Date(record.dateTime);
        const formatted = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}, ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
        return { ...record, dateTime: formatted };
      }
      return record;
    });

    setMasterRecords(formattedRecords.reverse());
  }, []);

  const uniqueValues = {
    type: [...new Set(masterRecords.map(r => r.type))],
    name: [...new Set(masterRecords.map(r => r.name))],
    gmds: [...new Set(masterRecords.map(r => r.gmds))],
    qty: [...new Set(masterRecords.map(r => r.qty || '-'))],
    Lqty: [...new Set(masterRecords.map(r => r.Lqty || '-'))],
    Aqty: [...new Set(masterRecords.map(r => r.Aqty || '-'))],
    location: [...new Set(masterRecords.map(r => r.location))],
    Engineer: [...new Set(masterRecords.map(r => r.Engn))]
  };

  const filteredRecords = masterRecords.filter(record => {
    return (
      (columnFilters.type === '' || record.type === columnFilters.type) &&
      (columnFilters.name === '' || record.name === columnFilters.name) &&
      (columnFilters.gmds === '' || String(record.gmds) === columnFilters.gmds) &&
      (columnFilters.qty === '' || String(record.qty || '-') === columnFilters.qty) &&
      (columnFilters.Lqty === '' || String(record.Lqty || '-') === columnFilters.Lqty) &&
      (columnFilters.Aqty === '' || String(record.Aqty || '-') === columnFilters.Aqty) &&
      (columnFilters.location === '' || record.location === columnFilters.location) &&
      (columnFilters.Engineer === '' || record.Engn === columnFilters.Engineer) &&
      (record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.Engn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.dateTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(record.gmds).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className='pt-14'><LowStockAlert /></div>

      <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Master Log</h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by Type, Component, GMDS or Engineer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto rounded border">
          <table className="min-w-full border whitespace-nowrap text-center">
            <thead className="sticky top-0 bg-gray-200 z-10">
              <tr className="bg-orange-500 text-center">
                <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded">S.No.</th>
                {['type', 'name', 'gmds', 'qty', 'Lqty', 'Aqty', 'location', 'Engineer'].map((col, idx) => (
                  <th key={idx} className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded">
                    <span className="pointer-events-none font-semibold capitalize block leading-tight">
                      {col === 'qty' ? (
                        <>
                          Deposit / <br /> Required Qty
                        </>
                      ) : col === 'Engineer' ? 'Engineer' : col}
                      {columnFilters[col] && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
                    </span>
                    <select
                      value={columnFilters[col]}
                      onChange={(e) => setColumnFilters({ ...columnFilters, [col]: e.target.value })}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">{col === 'qty' ? 'Deposit/Required Qty' : col === 'Engineer' ? 'Engineer' : col}</option>
                      {uniqueValues[col].map((val, i) => (
                        <option key={i} value={val}>{val}</option>
                      ))}
                    </select>
                  </th>
                ))}
                <th className="p-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                // filteredRecords.map((log, idx) => (
                paginatedRecords.map((log, idx) => (

                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-2 border">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination1 */}

        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </>
  );
}

