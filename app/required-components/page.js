// RESPONSIVE

"use client";
import { useState, useEffect } from 'react';
import LowStockAlert from '@/Components/LowStockAlert';

export default function RequiredComponentsPage() {
  const [components, setComponents] = useState([]);
  const [requiredRecords, setRequiredRecords] = useState([]);
  const [componentNames, setComponentNames] = useState([]);
  const [form, setForm] = useState({ name: '', qty: '', Engn: '' });
  const [engineerName, setEngineerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedComps = JSON.parse(localStorage.getItem('components')) || [];
    setComponents(storedComps);
    setComponentNames(storedComps.map(c => c.name));

    const storedRequired = JSON.parse(localStorage.getItem('requiredRecords')) || [];
    setRequiredRecords(storedRequired);

    const eng = localStorage.getItem('engineerName') || '';
    setEngineerName(eng);
    setForm({ name: '', qty: '', Engn: eng });
  }, []);

  const saveAll = (comps, records) => {
    localStorage.setItem('components', JSON.stringify(comps));
    localStorage.setItem('requiredRecords', JSON.stringify(records));
  };

  const logToMaster = (entry) => {
    const logs = JSON.parse(localStorage.getItem('masterRecords')) || [];
    const dateTime = new Date().toLocaleString();
    const updatedLogs = [...logs, { ...entry, dateTime }];
    localStorage.setItem('masterRecords', JSON.stringify(updatedLogs));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedComps = components.map(c => {
      if (c.name === form.name) {
        return { ...c, Lqty: parseInt(c.Lqty, 10) - parseInt(form.qty, 10) };
      }
      return c;
    });
    setComponents(updatedComps);

    const matchedComponent = updatedComps.find(c => c.name === form.name);
    const dateTime = new Date().toLocaleString();

    const newRecord = {
      serialNumber: matchedComponent.serialNumber,
      name: form.name,
      requiredQty: form.qty,
      updatedLqty: matchedComponent.Lqty,
      Engn: form.Engn,
      dateTime
    };

    const updatedRecords = [...requiredRecords, newRecord];
    setRequiredRecords(updatedRecords);
    saveAll(updatedComps, updatedRecords);

    logToMaster({
      type: 'Required',
      name: form.name,
      qty: form.qty,
      gmds: matchedComponent.gmds,
      Lqty: matchedComponent.Lqty,
      Aqty: matchedComponent.Aqty,
      location: matchedComponent.location,
      Engn: form.Engn,
    });

    setForm({ name: '', qty: '', Engn: engineerName });
  };

  const filteredRecords = requiredRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.Engn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='pt-14'><LowStockAlert /></div>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Required Components</h1>
        <p className="text-sm text-gray-600 mb-4">
          Logged in as: <strong>{engineerName}</strong>
        </p>

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
            placeholder="Required Quantity"
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
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Require
          </button>
        </form>

        <div className="mt-10">
          <input
            type="text"
            placeholder="Search by component or engineer name..."
            className="w-full border p-2 mb-4"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredRecords.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Recent Required Components</h2>
            <table className="min-w-full border whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">S.No.</th>
                  <th className="p-2">Component</th>
                  <th className="p-2">Required Qty</th>
                  <th className="p-2">Updated Live Qty</th>
                  <th className="p-2">Engineer</th>
                  <th className="p-2">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.requiredQty}</td>
                    <td className="p-2">{r.updatedLqty}</td>
                    <td className="p-2">{r.Engn}</td>
                    <td className="p-2 text-sm text-gray-600">{r.dateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No matching required components found.</p>
        )}
      </div>
    </>
  );
}
