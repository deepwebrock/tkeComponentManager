// RESPONSIVE

'use client';
import { useState, useEffect } from 'react';
import LowStockAlert from '@/Components/LowStockAlert';

export default function DepositComponentsPage() {
  const [components, setComponents] = useState([]);
  const [depositRecords, setDepositRecords] = useState([]);
  const [componentNames, setComponentNames] = useState([]);
  const [form, setForm] = useState({ name: '', qty: '', Engn: '' });
  const [engineerName, setEngineerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState({ name: '', depositQty: '', Engn: '', updatedLqty: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // You can change this to any number

  // Pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, columnFilters]);



  useEffect(() => {
    const storedComps = JSON.parse(localStorage.getItem('components')) || [];
    setComponents(storedComps);
    setComponentNames(storedComps.map(c => c.name));

    const storedDeposits = JSON.parse(localStorage.getItem('depositRecords')) || [];
    setDepositRecords(storedDeposits);

    const eng = localStorage.getItem('engineerName') || '';
    setEngineerName(eng);
    setForm({ name: '', qty: '', Engn: eng });
  }, []);

  const saveAll = (comps, deposits) => {
    localStorage.setItem('components', JSON.stringify(comps));
    localStorage.setItem('depositRecords', JSON.stringify(deposits));
  };

  const logToMaster = (entry) => {
    const logs = JSON.parse(localStorage.getItem('masterRecords')) || [];
    const now = new Date();
    const dateTime = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const updatedLogs = [...logs, { ...entry, dateTime }];
    localStorage.setItem('masterRecords', JSON.stringify(updatedLogs));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ❗ Validation: Check if qty is a valid positive number
    if (!form.qty || parseInt(form.qty) <= 0) {
      alert("❌ Deposit Quantity must be a positive number.");
      return;
    }

    const selected = components.find(c => c.name === form.name);
    if (!selected) return;

    const newLiveQty = parseInt(selected.Lqty, 10) + parseInt(form.qty, 10);

    const updatedComps = components.map(c =>
      c.name === form.name
        ? { ...c, Lqty: newLiveQty }
        : c
    );
    setComponents(updatedComps);

    const now = new Date();
    const dateTime = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newDeposit = {
      serialNumber: selected.serialNumber,
      name: form.name,
      depositQty: form.qty,
      Engn: form.Engn,
      updatedLqty: newLiveQty,
      dateTime
    };
    const updatedDeposits = [...depositRecords, newDeposit];
    setDepositRecords(updatedDeposits);

    logToMaster({
      type: 'Deposit',
      name: form.name,
      qty: form.qty,
      gmds: selected.gmds,
      Lqty: newLiveQty,
      Aqty: selected.Aqty,
      location: selected.location,
      Engn: form.Engn,
    });

    saveAll(updatedComps, updatedDeposits);
    setForm({ name: '', qty: '', Engn: engineerName });
  };


  const uniqueValues = {
    name: [...new Set(depositRecords.map(r => r.name))],
    depositQty: [...new Set(depositRecords.map(r => r.depositQty))],
    Engn: [...new Set(depositRecords.map(r => r.Engn))],
    updatedLqty: [...new Set(depositRecords.map(r => r.updatedLqty))]
  };



  const filteredDeposits = depositRecords.filter(record =>
    (columnFilters.name === '' || record.name === columnFilters.name) &&
    (columnFilters.depositQty === '' || record.depositQty === columnFilters.depositQty) &&
    (columnFilters.Engn === '' || record.Engn === columnFilters.Engn) &&
    (columnFilters.updatedLqty === '' || String(record.updatedLqty) === columnFilters.updatedLqty) &&
    (
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.Engn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.dateTime.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  // pagination
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const paginatedDeposits = filteredDeposits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className='pt-14'><LowStockAlert /></div>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Deposit Components</h1>
        <p className="text-sm text-gray-600 mb-4">
          Logged in as: <strong>{engineerName}</strong>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <select
            className="w-full border p-2"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          >
            <option value="">-- Select Component --</option>
            {componentNames.map((n, i) => (
              <option key={i} value={n}>{n}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Deposit Quantity"
            className="w-full border p-2"
            value={form.qty}
            onChange={e => setForm({ ...form, qty: e.target.value })}
            required
          />


          <input
            type="text"
            className="w-full border p-2 bg-gray-100 text-gray-600"
            value={form.Engn}
            readOnly
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Deposit
          </button>
        </form>

        {/* Search */}
        <div className="mt-10">
          <input
            type="text"
            placeholder="Search by component, engineer or date..."
            className="w-full border p-2 mb-4"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Recent Deposits</h2>
          <table className="min-w-full border whitespace-nowrap text-center">
            <thead>
              <tr className="bg-orange-500 text-center">
                <th className="p-2">S.No.</th>

                <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded">
                  <span className="pointer-events-none font-semibold flex justify-center items-center gap-1">
                    Component
                    {columnFilters.name && <span className="text-blue-500 text-xs">⚗️</span>}
                  </span>
                  <select
                    value={columnFilters.name}
                    onChange={(e) => setColumnFilters({ ...columnFilters, name: e.target.value })}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="">Component</option>
                    {uniqueValues.name.map((val, i) => (
                      <option key={i} value={val}>{val}</option>
                    ))}
                  </select>
                </th>

                <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded">
                  <span className="pointer-events-none font-semibold flex justify-center items-center gap-1">
                    Deposited Qty
                    {columnFilters.depositQty && <span className="text-blue-500 text-xs">⚗️</span>}
                  </span>
                  <select
                    value={columnFilters.depositQty}
                    onChange={(e) => setColumnFilters({ ...columnFilters, depositQty: e.target.value })}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="">Deposited Qty</option>
                    {uniqueValues.depositQty.map((val, i) => (
                      <option key={i} value={val}>{val}</option>
                    ))}
                  </select>
                </th>

                <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded">
                  <span className="pointer-events-none font-semibold flex justify-center items-center gap-1">
                    Engineer
                    {columnFilters.Engn && <span className="text-blue-500 text-xs">⚗️</span>}
                  </span>
                  <select
                    value={columnFilters.Engn}
                    onChange={(e) => setColumnFilters({ ...columnFilters, Engn: e.target.value })}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="">Engineer</option>
                    {uniqueValues.Engn.map((val, i) => (
                      <option key={i} value={val}>{val}</option>
                    ))}
                  </select>
                </th>

                <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded">
                  <span className="pointer-events-none font-semibold flex justify-center items-center gap-1">
                    Updated Live Qty
                    {columnFilters.updatedLqty && <span className="text-blue-500 text-xs">⚗️</span>}
                  </span>
                  <select
                    value={columnFilters.updatedLqty}
                    onChange={(e) => setColumnFilters({ ...columnFilters, updatedLqty: e.target.value })}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="">Updated Live Qty</option>
                    {uniqueValues.updatedLqty.map((val, i) => (
                      <option key={i} value={val}>{val}</option>
                    ))}
                  </select>
                </th>

                <th className="p-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length > 0 ? (
                paginatedDeposits.map((r, i) => (

                  <tr key={i} className="border-t">
                    <td className="p-2">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.depositQty}</td>
                    <td className="p-2">{r.Engn}</td>
                    <td className="p-2">{r.updatedLqty}</td>
                    <td className="p-2 text-sm text-gray-600">{r.dateTime}</td>
                  </tr>
                ))
              ) : (
                <tr className=''>
                  <td className="p-4  text-center text-gray-500" colSpan="6">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
