import React, { useState } from 'react';

export default function AuthPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function submit(e) {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:4000/api/login' : 'http://localhost:4000/api/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || JSON.stringify(data));
        return;
      }

      if (isLogin) {
        // Only on login do we go to TodoPage
        onSuccess(data.userId);
      } else {
        // After register, show message and switch to login
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setForm({ ...form, password: '' }); // clear password field
      }
    } catch (err) {
      alert('Network error');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setIsLogin(true)} disabled={isLogin}>Login</button>{' '}
        <button onClick={() => setIsLogin(false)} disabled={!isLogin}>Register</button>
      </div>

      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        {!isLogin && (
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
}
