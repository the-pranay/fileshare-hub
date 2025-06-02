'use client';

import { useState } from 'react';

export default function FileUploaderMinimal() {
  const [test, setTest] = useState('test');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Minimal File Uploader</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p>Basic uploader without external dependencies</p>
        <p>State test: {test}</p>
      </div>
    </div>
  );
}
