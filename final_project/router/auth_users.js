const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username =req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  res.status(200).json({ accessToken });
  
});

// Add a book review
function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Retrieve JWT token from request headers

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.username = decoded.username; // Extract username from decoded token
    next();
  });
}


regd_users.put("/auth/review/:isbn", (req, res) => {

  const { isbn } = req.params; 
  const review = req.query.review; 
  const username = req.username; 

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const existingReviewIndex = books[isbn].reviews.findIndex(entry => entry.username === username);

  if (existingReviewIndex !== -1) {
    
    books[isbn].reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    
    books[isbn].reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
