import React, { useEffect, useState } from 'react';

export default function TodoPage({ userId, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  async function fetchTodos() {
    try {
      // Pass userId as query param
      const res = await fetch(`http://localhost:5000/api/todos?userId=${userId}`);

      if (res.status === 400) {
        const errData = await res.json();
        alert(errData.msg || 'Invalid request');
        onLogout();
        return;
      }

      const data = await res.json();
if (res.ok && Array.isArray(data)) {
  setTodos(data);
} else {
  setTodos([]);
  alert(data.msg || 'Invalid data format');
}

    } catch (err) {
      console.error(err);
      alert('Could not load todos');
      setTodos([]);
    }
  }

  async function addTodo(e) {
   e.preventDefault();
   if (!text) return;

   const newTodo = { text, userId };

   try {
     // Optimistic UI: Add the todo before making the network request
     setTodos(prev => [...prev, { ...newTodo, id: Date.now(), createdAt: new Date() }]);

     // Send userId in POST body
     const res = await fetch('http://localhost:5000/api/todos', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(newTodo),
     });

     const data = await res.json();

     if (!res.ok) {
       alert(data.msg || 'Error adding todo');
       return;
     }

     // Replace the optimistic todo with the server response (if necessary)
     setTodos(prev => prev.map(todo => (todo.id === newTodo.id ? data : todo)));
     setText('');
   } catch (err) {
     console.error(err);
     alert('Network error');
   }
 }

  async function removeTodo(id) {
    if (!window.confirm('Delete this todo?')) return;

    try {
      // Pass userId as query param for delete
      const res = await fetch(`http://localhost:5000/api/todos/${id}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        setTodos(prev => prev.filter(t => t.id !== id));
      } else {
        const d = await res.json();
        alert(d.msg || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={onLogout}>Logout</button>
      </div>

      <form onSubmit={addTodo} style={{ marginBottom: 16 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New todo"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.length > 0 ? (
          todos.map(t => (
            <li key={t.id} style={{ marginBottom: 8 }}>
              {t.text}{' '}
              <button onClick={() => removeTodo(t.id)}>Delete</button>
              <div style={{ fontSize: 12, color: '#666' }}>
                {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'No Date'}
              </div>
            </li>
          ))
        ) : (
          <p>No todos available</p>
        )}
      </ul>
    </div>
  );
}
