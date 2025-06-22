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
    const dateTime = new Date().toLocaleString();
    const updatedLogs = [...logs, { ...entry, dateTime }];
    localStorage.setItem('masterRecords', JSON.stringify(updatedLogs));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selected = components.find(c => c.name === form.name);
    if (!selected) return;

    const newLiveQty = parseInt(selected.Lqty, 10) + parseInt(form.qty, 10);

    const updatedComps = components.map(c =>
      c.name === form.name
        ? { ...c, Lqty: newLiveQty }
        : c
    );
    setComponents(updatedComps);

    const dateTime = new Date().toLocaleString();
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

  const filteredDeposits = depositRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.Engn.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search by component or engineer name..."
            className="w-full border p-2 mb-4"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        {filteredDeposits.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Recent Deposits</h2>
            <table className="min-w-full border whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">S.No.</th>
                  <th className="p-2">Component</th>
                  <th className="p-2">Deposited Qty</th>
                  <th className="p-2">Engineer</th>
                  <th className="p-2">Updated Live Qty</th>
                  <th className="p-2">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.depositQty}</td>
                    <td className="p-2">{r.Engn}</td>
                    <td className="p-2">{r.updatedLqty}</td>
                    <td className="p-2 text-sm text-gray-600">{r.dateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No matching deposit records found.</p>
        )}
      </div>
    </>
  );
}
