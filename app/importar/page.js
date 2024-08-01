'use client'

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post('/api/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.error(error);
    });
  };

  const handleExport = async () => {
    const response = await axios.get('/api/export', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h1>Import/Export XLSX</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleImport}>Import</button>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}