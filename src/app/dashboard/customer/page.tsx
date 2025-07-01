'use client';
import { useEffect, useState } from 'react';

export default function CustomerDashboard() {
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/customer/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setName(data.name))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {name} 👋</h1>
    </div>
  );
}
