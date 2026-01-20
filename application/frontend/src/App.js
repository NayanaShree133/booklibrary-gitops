import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");

  // API base URL (ALB or empty = same origin)
  const API = process.env.REACT_APP_API_URL || "";

  // Fetch all books on page load
  useEffect(() => {
    fetch(`${API}/books`)  // Fixed: parentheses around template literal
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, [API]);  // Added API to dependency array

  // Add a book
  const addBook = async () => {
    if (!title || !author || !published) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch(`${API}/books`, {  // Fixed: parentheses
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, published })
      });
      const data = await res.json();
      // Add new book to UI
      setBooks([...books, data]);
      // Clear form fields
      setTitle("");
      setAuthor("");
      setPublished("");
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  // Delete a book
  const deleteBook = async (id) => {
    try {
      await fetch(`${API}/books/${id}`, { method: "DELETE" });  // Fixed: parentheses
      setBooks(books.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="container">
      <h1>Book Library</h1>
      <div className="form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          placeholder="Published Year"
          value={published}
          onChange={(e) => setPublished(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} ({book.published || "N/A"})
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;