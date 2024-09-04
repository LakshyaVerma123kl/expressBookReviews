const express = require("express");
let books = require("./booksdb.js"); // Import books data
let isValid = require("./auth_users.js").isValid; // Import authentication functions if needed
let users = require("./auth_users.js").users; // Import users data if needed
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.some((u) => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register new user
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  res.json(Object.values(books));
});

// Get book details based on ID (ISBN)
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(
    (b) => b.author.toLowerCase() === author.toLowerCase()
  );

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(
    (b) => b.title.toLowerCase() === title.toLowerCase()
  );

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book reviews based on ID (ISBN)
public_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews || [];
    res.json(reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
