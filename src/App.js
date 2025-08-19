import React, { useState } from 'react';
import AuthPage from './AuthPage';
import TodoPage from './TodoPage';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleLogin = (id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
  };
  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Simple Todo App</h1>
      {userId ? (
        <TodoPage userId={userId} onLogout={handleLogout} />
      ) : (
        <AuthPage onSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;
