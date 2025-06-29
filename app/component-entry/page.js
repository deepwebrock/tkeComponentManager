// RESPONSIVE PAGE 


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LowStockAlert from '@/Components/LowStockAlert';
import { useRef } from 'react';




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

  const [columnFilters, setColumnFilters] = useState({
    name: '',
    gmds: '',
    Lqty: '',
    Aqty: '',
    location: '',
    Engn: ''
  });


  const [editIndex, setEditIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // You can change this to 10 or any number you like

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters/search changes
  }, [searchQuery, columnFilters]);



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
    const original = components[editIndex];

    const isChanged =
      form.name !== original.name ||
      form.gmds !== original.gmds ||
      String(form.Lqty) !== String(original.Lqty) ||
      String(form.Aqty) !== String(original.Aqty) ||
      form.location !== original.location ||
      form.Engn !== original.Engn;

    if (!isChanged) {
      alert('⚠️ No changes detected. Nothing updated.');
      setEditIndex(null);
      return;
    }

    newComponent = { ...form };
    updatedComponents[editIndex] = newComponent;

    logToMaster({
      type: 'New Component Entry Updated',
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
    const gmdsExists = components.some(c => c.gmds === form.gmds);
    if (gmdsExists) {
      alert('❌ Component with this GMDS code already exists!');
      return;
    }

    newSerial = components.length > 0
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

  const nextSerial = updatedComponents.length > 0
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
    const deletedComponent = components[index];

    const confirmed = window.confirm(
      `Are you sure you want to delete:\n\nComponent: ${deletedComponent.name}\nGMDS: ${deletedComponent.gmds}?`
    );

    if (!confirmed) return; // If user cancels, do nothing

    const isEditingDeletedRow = editIndex === index;

    // Log the deleted item
    logToMaster({
      type: 'New Component Entry Deleted',
      serialNumber: deletedComponent.serialNumber,
      name: deletedComponent.name,
      qty: '',
      gmds: deletedComponent.gmds,
      Lqty: deletedComponent.Lqty,
      Aqty: deletedComponent.Aqty,
      location: deletedComponent.location,
      Engn: deletedComponent.Engn
    });

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


  // const filteredComponents = components.filter(c =>
  //   c.name.toLowerCase().includes(searchQuery) ||
  //   c.gmds.toLowerCase().includes(searchQuery) ||
  //   c.Engn.toLowerCase().includes(searchQuery)
  // );


  const filteredComponents = components.filter(c => {
    const matchesColumnFilters =
      (columnFilters.name === '' || c.name === columnFilters.name) &&
      (columnFilters.gmds === '' || c.gmds === columnFilters.gmds) &&
      (columnFilters.location === '' || c.location === columnFilters.location) &&
      (columnFilters.Engn === '' || c.Engn === columnFilters.Engn) &&
      (columnFilters.Lqty === '' || c.Lqty === columnFilters.Lqty) &&
      (columnFilters.Aqty === '' || c.Aqty === columnFilters.Aqty);

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery) ||
      c.gmds.toLowerCase().includes(searchQuery) ||
      c.location.toLowerCase().includes(searchQuery) ||
      c.Engn.toLowerCase().includes(searchQuery) ||
      c.Lqty.toLowerCase?.().includes?.(searchQuery) || // Optional
      c.Aqty.toLowerCase?.().includes?.(searchQuery);    // Optional

    return matchesColumnFilters && matchesSearch;
  });

  const uniqueValues = {
    name: [...new Set(components.map(c => c.name))],
    gmds: [...new Set(components.map(c => c.gmds))],
    location: [...new Set(components.map(c => c.location))],
    Engn: [...new Set(components.map(c => c.Engn))],
    Lqty: [...new Set(components.map(c => c.Lqty))],
    Aqty: [...new Set(components.map(c => c.Aqty))]
  };

  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);
  const paginatedComponents = filteredComponents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
              placeholder="Search by Name or GMDS or Location or Engineer Name"
              className="w-full border p-2 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">All Components</h2>

          <div className="overflow-x-auto text-center">
            <table className="min-w-full border whitespace-nowrap text-center ">
              <thead className=''>
                <tr className="bg-orange-500 text-center">
                  <th className="p-2">S.No.</th>

                  <th
                    className={`relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-white rounded `}
                  >
                    <span className="pointer-events-none font-bold flex items-center justify-center gap-1">
                      Component
                      {columnFilters.name && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
                    </span>

                    <select
                      value={columnFilters.name}
                      onChange={(e) =>
                        setColumnFilters({ ...columnFilters, name: e.target.value })
                      }
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">Component</option>
                      {uniqueValues.name.map((val, i) => (
                        <option key={i} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </th>



                  <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-gray-100 rounded">
                    <span className="pointer-events-none font-bold flex items-center justify-center gap-1">
                      GMDS
                      {columnFilters.gmds && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
                    </span>
                    <select
                      value={columnFilters.gmds}
                      onChange={(e) => setColumnFilters({ ...columnFilters, gmds: e.target.value })}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">GMDS</option>
                      {uniqueValues.gmds.map((val, i) => (
                        <option key={i} value={val}>{val}</option>
                      ))}
                    </select>
                  </th>

                  <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-gray-100 rounded">
                    <span className="pointer-events-none font-bold flex items-center justify-center gap-1">
                      Lqty
                      {columnFilters.Lqty && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
                    </span>
                    <select
                      value={columnFilters.Lqty}
                      onChange={(e) => setColumnFilters({ ...columnFilters, Lqty: e.target.value })}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">Live Qty</option>
                      {uniqueValues.Lqty.map((val, i) => (
                        <option key={i} value={val}>{val}</option>
                      ))}
                    </select>
                  </th>

                  <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-gray-100 rounded">
                    <span className="pointer-events-none font-bold flex items-center justify-center gap-1">
                      Aqty
                      {columnFilters.Aqty && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
                    </span>
                    <select
                      value={columnFilters.Aqty}
                      onChange={(e) => setColumnFilters({ ...columnFilters, Aqty: e.target.value })}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">Alert Qty</option>
                      {uniqueValues.Aqty.map((val, i) => (
                        <option key={i} value={val}>{val}</option>
                      ))}
                    </select>
                  </th>

                  <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-gray-100 rounded">
                    <span className="pointer-events-none font-bold flex items-center justify-center gap-1">
                      Location
                      {columnFilters.location && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
                    </span>
                    <select
                      value={columnFilters.location}
                      onChange={(e) => setColumnFilters({ ...columnFilters, location: e.target.value })}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">Location</option>
                      {uniqueValues.location.map((val, i) => (
                        <option key={i} value={val}>{val}</option>
                      ))}
                    </select>
                  </th>

                  {/* <th className="p-2">
                    <select
                      className="rounded"
                      value={columnFilters.Engn}
                      onChange={e => setColumnFilters({ ...columnFilters, Engn: e.target.value })}
                    >
                      <option className='text-center' value="">Engineers</option>
                      {uniqueValues.Engn.map((val, i) => (
                        <option key={i} value={val}>{val}</option>
                      ))}
                    </select>
                  </th> */}

                  <th className="relative p-2 text-center transition-all duration-150 hover:scale-100 hover:bg-gray-100 rounded">
                    <span className="pointer-events-none font-bold flex items-center justify-center gap-1">
                      Engineer
                      {columnFilters.Engn && <span className="text-blue-500 text-xs pl-1">⚗️</span>}
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

                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>

              {/* <tbody>
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((comp, idx) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody> */}

              <tbody>
                {paginatedComponents.length > 0 ? (
                  paginatedComponents.map((comp, idx) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
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
      </div>
    </>
  );
}