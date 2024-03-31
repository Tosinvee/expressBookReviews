const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" }); 
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  //Write your code here
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  console.log("Request Params:", req.params)
  const isbn = req.params.isbn;
  console.log(isbn)
  if (books.hasOwnProperty(isbn)){
    res.status(200).json({
      message: 'Book details retrieved successfully',
      data: books[isbn]
    });
  } else {
    console.error("Book not found for ISBN:", isbn);
    res.status(404).json({
      message: 'Book not found'
    });
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksArrray = Object.values(books);
  const matchingBooks = booksArrray.filter(book => book.author === author);

  if(matchingBooks.length > 0){
    res.status(200).json({
      message: 'books found for author',
      data: matchingBooks
    })
  }else{
    res.status(404).json({
      message: 'No book found for author'
    })
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArrray = Object.values(books);
  const matchingBooks = booksArrray.filter(book => book.title === title);

  if(matchingBooks.length > 0){
    res.status(200).json({
      message: 'books found for this  author',
      data: matchingBooks
    })
  }else{
    res.status(404).json({
      message: 'No book found for this author'
    })
  }

  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;
    if (Object.keys(reviews).length > 0) {
      res.status(200).json({
        message: 'Book reviews retrieved successfully',
        data: reviews
      });
    } else {
      res.status(404).json({
        message: 'No reviews found for the book'
      });
    }
  } else {
    res.status(404).json({
      message: 'Book not found'
    });
  }
});

module.exports.general = public_users;
