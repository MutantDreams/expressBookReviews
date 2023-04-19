const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ Message: "Something is wrong. Try again" });
  }

  if (isValid(username)) {
    return res
      .status(403)
      .json({ Message: "Username already exists." });
  }

  const user = { username, password };
  users.push(user);

  return res.status(200).json({ Message: "Success" });
});


// Async Get the book list available in the shop
public_users.get("/async", async (req, res) => {
  let response = await axios.get("http://localhost:5000/");
  return res.send(response.data);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});


// Async Get book details based on ISBN selected
public_users.get("/async/isbn/:isbn", (req, res) => {
  axios.get("http://localhost:5000/isbn/" + req.params.isbn)
    .then((response) => { return res.status(200).json(response.data); })
    .catch((err) => { return res.send(err); });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
});

// Async Get book details based on author
public_users.get("/async/author/:author", async (req, res) => {
  let response = await axios.get("http://localhost:5000/author/" + req.params.author);
  return res.status(200).json(response.data);
});



// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({
        "isbn": isbn,
        "title": books[isbn]["title"],
        "reviews": books[isbn]["reviews"]
      });
    }
  });
  res.send(JSON.stringify({ booksbyauthor }, null, 4));
});


// Async Get all books based on title
public_users.get("/async/title/:title", async (req, res) => {
  let response = await axios.get("http://localhost:5000/title/" + req.params.title);
  return res.status(200).json(response.data)
});



// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["title"] === req.params.title) {
      booksbytitle.push({
        "isbn": isbn,
        "author": books[isbn]["author"],
        "reviews": books[isbn]["reviews"]
      });
    }
  });
  res.send(JSON.stringify({ booksbytitle }, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ Message: "ISBN not found" });
  }
  const review = books[isbn].review;

  return res.status(200).json(review);
});

module.exports.general = public_users;
