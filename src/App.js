import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { db } from "./firebaseConfig"; // Import Firestore instance
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; 
import "react-quill/dist/quill.snow.css";

const App = () => {
  const [content, setContent] = useState("");

  const docRef = doc(db, "documents", "shared-doc"); // Reference to the document in Firestore

  useEffect(() => {
    // Fetch the initial content
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().content);
      }
    };

    fetchData();

    // Real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContent(docSnap.data().content);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = async (value) => {
    setContent(value);
    await setDoc(docRef, { content: value }); // Save the content to Firestore
  };

  const handleClearText = async () => {
    setContent(""); // Clear the editor content
    await setDoc(docRef, { content: "" }); // Save the empty content to Firestore
  };

  return (
    <div>
      <h1>Shared Document</h1>
      {/* Clear Text Button on Top */}
      <button onClick={handleClearText} style={{ marginBottom: "10px" }}>Clear Text</button>
      {/* Text Editor */}
      <ReactQuill value={content} onChange={handleChange} />
    </div>
  );
};

export default App;
