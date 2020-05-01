const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const books = [
  {
    "author": "Chinua Achebe",
    "country": "Nigeria",
    "language": "English",
    "pages": 209,
    "title": "Things Fall Apart",
    "year": 1958
  },
  {
    "author": "Hans Christian Andersen",
    "country": "Denmark",
    "language": "Danish",
    "pages": 784,
    "title": "Fairy tales",
    "year": 1836
  },
  {
    "author": "Dante Alighieri",
    "country": "Italy",
    "language": "Italian",
    "pages": 928,
    "title": "The Divine Comedy",
    "year": 1315
  },
];

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }

      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}


app.get('/books', authenticateJWT,  (req, res, next) => {
  res.status(200).json(books)
})

app.post('/books', authenticateJWT,  (req, res, next) => {
  const { role } = req.user

  if (role !== 'admin') {
    return res.sendStatus(403)
  }

  const newBook = req.body
  books.push(newBook)

  res.status(201).json({ message: 'Book added' })
})

app.listen(4000, () => console.log('Books service has been started on port 4000...'))