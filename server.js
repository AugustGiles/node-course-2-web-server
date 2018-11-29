const express = require('express');
const hbs = require('hbs')
const fs = require('fs')

// sets up environment variable for heroku and if not available, will set port 3000 (dev)
const port = process.env.PORT || 3000;

// requirement for node to set up server
let app = express();

// partials for hbs files
hbs.registerPartials(__dirname + '/views/partials');

// helper functions to be put in the hbs files
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

// let node know we're using hbs as the view engine
app.set('view engine', 'hbs');

// app.use takes a function which has built in arguments - registers middleware
// middleware needs to be told next() in order to keep going. If we want it to stop at the middleware, use res()
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  fs.appendFile('server.log', log + '\n', (e) => e ? console.log('unable to append to server.log') : null)
  console.log(log)
  next();
});

// maintenance file
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// app.use registers middleware - we can now navigate to anything in the public directory from the browser
app.use(express.static(__dirname + '/public'));

// setting up requests
app.get('/', (req, res) => {
  // render lets you render any view set up with view engine
  // first argument specifies template to render, second argument is an object and the kv pairs are the dynamic content in the page
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hey there guys. Welcome to this awesome site!'
  });
});

app.get('/about', (req, res) => {
  // render lets you render any view set up with view engine
  // first argument specifies template to render, second argument is an object and the kv pairs are the dynamic content in the page
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  // json as error
  res.send({
    errorMessage: 'unable to fulfill request'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Portfolio Page'
  })
})

// tells node to listen on port 3000
app.listen(port, () => {
  console.log(`server is up on port ${port}`)
});
