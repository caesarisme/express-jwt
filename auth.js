const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const ACCESS_TOKEN_SECRET = 'access_secret'
const REFRESH_TOKEN_SECRET = 'refresh_secret';
let refreshTokens = [];

const users = [
  {
    username: 'caesarisme',
    password: 'Kaisar0404',
    role: 'admin'
  },
  {
    username: 'leancore',
    password: 'leancoregg',
    role: 'member'
  }
]

app.use('/login', (req, res, next) => {
  const { username, password } = req.body

  const user = users.find(u => u.username === username && u.password === password)

  if (user) {
    const accessToken = jwt.sign({ username: user.username, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '5m' })

    const refreshToken = jwt.sign({ username: user.username, role: user.role }, REFRESH_TOKEN_SECRET)

    refreshTokens.push(refreshToken)

    return res.status(200).json({
      accessToken,
      refreshToken
    })
  }

  res.send('Invalid credentials')
})


app.post('/refresh', (req, res, next) => {
  const { token } = req.body

  if (!token) {
    return res.sendStatus(401)
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403)
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403)
    }

    const accessToken = jwt.sign({ username: user.username, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '5m' })

    res.status(200).json({
      accessToken
    })
  })
})


app.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);

  res.send("Logout successful");
});

app.listen(3000, () => console.log('Auth service has been started on port 3000...'))