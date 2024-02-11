const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {  
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});



//TASK 10
/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {        
    res.send(JSON.stringify( books,null,4));
    //probaremos sin usar el "return" ---> return
});*/

public_users.get('/', function(req, res) {
    // Simular una operación asincrónica, como una llamada a una base de datos
    new Promise((resolve, reject) => {
      // Simular un proceso asincrónico, como si estuvieras obteniendo los datos de una base de datos
      process.nextTick(() => resolve(books));
    })
    .then(booksList => {
      res.json(booksList); // Envía la lista de libros como respuesta
    })
    .catch(error => {
      res.status(500).json({ message: "Error al recuperar los libros" });
    });
  });


//TASK 11:
/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn;
    res.send(books[ISBN]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });*/
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
  
    // Simulando una operación asincrónica con una promesa
    new Promise((resolve, reject) => {
      // Suponiendo que hay alguna lógica para determinar si el libro existe
      const book = books[ISBN];
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    })
    .then(book => {
      res.json(book);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});



/*const authorName = req.params.author;
  let booksByAuthor = [];
  
  for (let isbn in books) {
      if (books.hasOwnProperty(isbn)) {
          let book = books[isbn];
          if (book.author === authorName) {
              // Agrega el libro al array si el autor coincide
              booksByAuthor.push(book);
          }
      }
  }

  // Si no se encuentran libros del autor, devuelve un mensaje de error
  if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
  } else {
      res.status(404).send('No books found by author ' + authorName);
  } */


//TASK 12
/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  const autorcito = req.params.author;
  // Convertir los valores del objeto `books` a un arreglo
  let filteredBooks = Object.values(books).filter(book => book.author === autorcito);  
  res.send(filteredBooks);
});
*/
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;
  
    try {
      const booksByAuthor = await new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === authorName);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error('No books found by that author'));
        }
      });
  
      res.json(booksByAuthor);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  



//TASK 13:
/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titulito = req.params.title;
  // Convertir los valores del objeto `books` a un arreglo
  let filteredBooks = Object.values(books).filter(book => book.title === titulito);  
  res.send(filteredBooks);
});
*/
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;  
    // Simular una operación asincrónica con una promesa
    new Promise((resolve, reject) => {
      // Simular la búsqueda de libros por autor
      let filteredBooks = Object.values(books).filter(book => book.title === title);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error('No books found by that author'));
      }
    })
    .then(booksByAuthor => {
      res.json(booksByAuthor);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
