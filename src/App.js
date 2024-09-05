import React, { useState, useEffect } from 'react';

function App() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch content from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/document');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setContent(data.content || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle content change
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  // Save content to server
  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Document saved:', data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Shared Document</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <textarea
        value={content}
        onChange={handleChange}
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default App;
