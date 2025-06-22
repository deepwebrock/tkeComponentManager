// RESPONSIVE PAGE 


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LowStockAlert from '@/Components/LowStockAlert';
import {useRef } from 'react';




const logToMaster = (entry) => {
  const oldLogs = JSON.parse(localStorage.getItem('masterRecords')) || [];
  const now = new Date();
  const dateTime = now.toLocaleString();
  const updatedLogs = [...oldLogs, { ...entry, dateTime }];
  localStorage.setItem('masterRecords', JSON.stringify(updatedLogs));
};

export default function ComponentEntryPage() {
  const nameInputRef = useRef(null);
  const router = useRouter();
  const [components, setComponents] = useState([]);
  const [engineerName, setEngineerName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    serialNumber: '',
    name: '',
    gmds: '',
    Lqty: '',
    Aqty: '',
    location: '',
    Engn: '',
  });
  

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) router.push('/login');
    const storedData = JSON.parse(localStorage.getItem('components')) || [];
    setComponents(storedData);

    const nextSerial =
      storedData.length > 0
        ? Math.max(...storedData.map(c => parseInt(c.serialNumber))) + 1
        : 1;

    const storedName = localStorage.getItem('engineerName') || '';
    setEngineerName(storedName);

    setForm(prev => ({
      ...prev,
      serialNumber: nextSerial,
      Engn: storedName
    }));
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('components', JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedComponents = [...components];

    let newSerial = form.serialNumber;
    let newComponent;

    if (editIndex !== null) {
      newComponent = { ...form };
      updatedComponents[editIndex] = newComponent;

      logToMaster({
        type: 'Edited',
        serialNumber: newComponent.serialNumber,
        name: newComponent.name,
        qty: '',
        gmds: newComponent.gmds,
        Lqty: newComponent.Lqty,
        Aqty: newComponent.Aqty,
        location: newComponent.location,
        Engn: newComponent.Engn
      });

      setEditIndex(null);
    } else {
      newSerial =
        components.length > 0
          ? Math.max(...components.map(c => parseInt(c.serialNumber))) + 1
          : 1;

      newComponent = { ...form, serialNumber: newSerial };
      updatedComponents.push(newComponent);

      logToMaster({
        type: 'New Entry',
        serialNumber: newComponent.serialNumber,
        name: newComponent.name,
        qty: '',
        gmds: newComponent.gmds,
        Lqty: newComponent.Lqty,
        Aqty: newComponent.Aqty,
        location: newComponent.location,
        Engn: newComponent.Engn
      });
    }

    setComponents(updatedComponents);
    saveToStorage(updatedComponents);

    const nextSerial =
      updatedComponents.length > 0
        ? Math.max(...updatedComponents.map(c => parseInt(c.serialNumber))) + 1
        : 1;

    setForm({
      serialNumber: nextSerial,
      name: '',
      gmds: '',
      Lqty: '',
      Aqty: '',
      location: '',
      Engn: engineerName,
    });
    nameInputRef.current?.focus();
  };

  const handleEdit = (index) => {
    setForm(components[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const isEditingDeletedRow = editIndex === index;
    const updated = components.filter((_, i) => i !== index);
    const reSerialed = updated.map((comp, idx) => ({
      ...comp,
      serialNumber: idx + 1
    }));
    setComponents(reSerialed);
    saveToStorage(reSerialed);

    if (isEditingDeletedRow) {
      setEditIndex(null);
      setForm({
        serialNumber: reSerialed.length + 1,
        name: '',
        gmds: '',
        Lqty: '',
        Aqty: '',
        location: '',
        Engn: engineerName,
      });
    } else {
      setForm(prev => ({
        ...prev,
        serialNumber: reSerialed.length + 1
      }));
    }
  };

  const filteredComponents = components.filter(c =>
    c.name.toLowerCase().includes(searchQuery) ||
    c.gmds.toLowerCase().includes(searchQuery) ||
    c.Engn.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <div className='pt-14'><LowStockAlert /></div>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">New Component Entry</h1>

        <p className="text-sm text-gray-600 mb-4">
          Logged in as: <strong>{engineerName}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input type="number" value={form.serialNumber} readOnly className="w-full border p-2 bg-gray-100 text-gray-600" />
          <input type="text" placeholder="Component Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2" required ref={nameInputRef} />
          <input type="number" placeholder="GMDS Code" value={form.gmds} onChange={(e) => setForm({ ...form, gmds: e.target.value })} className="w-full border p-2" required />
          <input type="number" placeholder="Live Quantity" value={form.Lqty} onChange={(e) => setForm({ ...form, Lqty: e.target.value })} className="w-full border p-2" required />
          <input type="number" placeholder="Alert Quantity" value={form.Aqty} onChange={(e) => setForm({ ...form, Aqty: e.target.value })} className="w-full border p-2" required />
          <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border p-2" required />
          <input type="text" value={form.Engn} readOnly className="w-full border p-2 bg-gray-100 text-gray-600" />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
            {editIndex !== null ? 'Update Component' : 'Add Component'}
          </button>
        </form>

        <div className="mt-10">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Name, GMDS or Engineer Name..."
              className="w-full border p-2 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">All Components</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border whitespace-nowrap">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">S.No.</th>
                  <th className="p-2">Component Name</th>
                  <th className="p-2">GMDS Code</th>
                  <th className="p-2">Live Qty</th>
                  <th className="p-2">Alert Qty</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Engineer</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComponents.map((comp, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{comp.serialNumber}</td>
                    <td className="p-2">{comp.name}</td>
                    <td className="p-2">{comp.gmds}</td>
                    <td className="p-2">{comp.Lqty}</td>
                    <td className="p-2">{comp.Aqty}</td>
                    <td className="p-2">{comp.location}</td>
                    <td className="p-2">{comp.Engn}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(idx)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(idx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}