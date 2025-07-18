import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to connect to the server.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Node.js Monorepo</h1>
        <p>
          {loading ? 'Loading...' : `Server says: "${message}"`}
        </p>
      </header>
    </div>
  );
}

export default App;
