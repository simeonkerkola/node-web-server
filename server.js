const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

const port = process.env.PORT || 3000 // command $ env, let heroku to set the port
var app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs') // set the view engine for express
app.use(express.static(__dirname + '/public')) // folder for static pages

app.use((req, res, next) => { // this middleware is not goin to move on until ve call next()
  var now = new Date().toString()
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log('Unable to append to server.log')
  })
  next()
})

// app.use((req, res, next) => {
//   res.render('maintanance.hbs')
// })

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})

// registering a handler for a http get -request
// 1starg url = root of the app, 2nd return results
app.get('/', (req, res) => { // request, response
  res.render('index.hbs', {
    welcomeMessage: 'Welcome to my page!',
    pageTitle: 'Home',
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  })
})

app.get('/blog', (req, res) => {
  res.send('My Blog')
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  })
})

app.listen(port, () => {
  console.log('Server is up on port:', port)
}) // binds the app to a port we are listening