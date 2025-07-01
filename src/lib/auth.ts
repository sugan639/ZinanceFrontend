'use client';

export async function loginUser(mobileNumber: string, password: string) {
  const res = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ensures cookies are stored
    body: JSON.stringify({ mobileNumber, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || 'Invalid credentials');
  }

  const user = await res.json(); // expects user object with name, role, etc.
  return user;
}
