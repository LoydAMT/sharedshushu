import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { db } from "./firebaseConfig"; // Import Firestore instance
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; 
import "react-quill/dist/quill.snow.css";

// Characters to use for replacement
const SPACE_CHAR = "ؚ";
const LINE_BREAK_CHAR = "⧫";
const CURSOR_CHAR = "⨯"; // Placeholder for cursor position

const App = () => {
  const [content, setContent] = useState("");
  const [editorKey, setEditorKey] = useState(Date.now()); // Use a key to force re-render if needed

  const docRef = doc(db, "documents", "shared-doc"); // Reference to the document in Firestore

  useEffect(() => {
    // Fetch the initial content
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let fetchedContent = docSnap.data().content || '';
          fetchedContent = fetchedContent.replace(new RegExp(LINE_BREAK_CHAR, 'g'), '\n')
                                        .replace(new RegExp(SPACE_CHAR, 'g'), ' ')
                                        .replace(new RegExp(CURSOR_CHAR, 'g'), ''); // Remove cursor placeholder
          setContent(fetchedContent);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      }
    };

    fetchData();

    // Real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        let updatedContent = docSnap.data().content || '';
        updatedContent = updatedContent.replace(new RegExp(LINE_BREAK_CHAR, 'g'), '\n')
                                      .replace(new RegExp(SPACE_CHAR, 'g'), ' ')
                                      .replace(new RegExp(CURSOR_CHAR, 'g'), ''); // Remove cursor placeholder
        setContent(updatedContent);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = async (value) => {
    let updatedContent = value.replace(/ /g, SPACE_CHAR)
                              .replace(/\n/g, LINE_BREAK_CHAR)
                              .replace(/⨯/g, CURSOR_CHAR); // Replace cursor placeholder
    setContent(value);
    try {
      await setDoc(docRef, { content: updatedContent }, { merge: true });
    } catch (error) {
      console.error("Error updating content: ", error.message);
    }
  };

  const handleClearText = async () => {
    setContent(""); // Clear the editor content locally first
    try {
      await setDoc(docRef, { content: "" }, { merge: true }); // Save the empty content to Firestore
    } catch (error) {
      console.error("Error clearing content: ", error.message);
    }
  };

  return (
    <div>
      <h1>Shared Document</h1>
      {/* Clear Text Button on Top */}
      <button onClick={handleClearText} style={{ marginBottom: "10px" }}>Clear Text</button>
      {/* Text Editor */}
      <ReactQuill 
        key={editorKey} // Use a unique key to force re-render if needed
        value={content} 
        onChange={handleChange} 
        placeholder="Start typing..." 
        formats={[
          'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'link', 'image'
        ]}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
      />
    </div>
  );
};

export default App;









/* import React, { useState, useEffect } from 'react';

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
        setContent(data.content || ''); // Handle empty or undefined content
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

export default App; */
