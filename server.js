// server.js

// set up ======================================================================
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    require('./app/routes.js')(app, passport, mongoose.connection); // use mongoose.connection
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// set up Express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static('public'));

// Passport configuration =====================================================
require('./config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({
  secret: 'rcbootcamp2021b', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs'); // set up ejs for templating

// API routes =================================================================

// Add a new throw session to the database
app.post('/sessions', (req, res) => {
  const { sessionName, sessionDate, pitchCount, strikeCount, ballCount } = req.body;

  // Ensure all required fields are present
  if (!sessionName || !sessionDate || !pitchCount || !strikeCount || !ballCount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert session data into 'throws' collection
  mongoose.connection.db.collection('sessions').insertOne({
    sessionName,
    sessionDate,
    pitchCount,
    strikeCount,
    ballCount,
    timestamp: new Date()  // Add a timestamp for the session
  }, (err, result) => {
    if (err) {
      console.error('Error adding session data:', err);
      return res.status(500).send('Error adding session data');
    }
    res.status(201).json({ message: 'Session saved successfully', id: result.insertedId });
  });
});









// GET route to fetch session data from the database
app.get('/pastsession', (req, res) => {
  mongoose.connection.db.collection('sessions').find().toArray((err, sessions) => {
    if (err) {
      console.error('Error fetching session data:', err);
      return res.status(500).send('Error fetching session data');
    }
    res.render('pastsession', { sessions });  // Pass the session data to the EJS page
  });
});

// Increment pitch count
app.put('/countUp', (req, res) => {
  mongoose.connection.db.collection('throws')
    .findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      { $inc: { pitchCount: 1 } },
      { sort: { _id: 1 }, upsert: true },
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
      }
    );
});

// Decrement pitch count
app.put('/countDown', (req, res) => {
  mongoose.connection.db.collection('throws')
    .findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      { $inc: { pitchCount: -1 } },
      { sort: { _id: 1 }, upsert: true },
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
      }
    );
});

// Delete a throw entry
app.delete('/messages', (req, res) => {
  mongoose.connection.db.collection('throws').findOneAndDelete(
    { name: req.body.name, msg: req.body.msg },
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Message deleted!');
    }
  );
});

// New route to handle past session data (from frontend)
app.post('/pastsession', (req, res) => {
  const { sessionName,pitchCount, ballCount, strikeCount, strikezoneData, sessionEndedAt } = req.body;

  // Ensure necessary fields are provided
  if (sessionName === undefined||pitchCount === undefined || ballCount === undefined || strikeCount === undefined || !strikezoneData) {
    return res.status(400).json({ message: 'Pitch count, ball count, strike count, and strike zone data are required' });
  }

  // Insert session data into 'sessions' collection
  mongoose.connection.db.collection('sessions').insertOne({
    sessionName,
    pitchCount,
    ballCount,
    strikeCount,
    strikezoneData,
    sessionEndedAt,
    timestamp: new Date()  // Add timestamp for session end
  }, (err, result) => {
    if (err) {
      console.error('Error adding session data:', err);
      return res.status(500).send('Error adding session data');
    }
    res.status(201).json({ message: 'Session data saved successfully', id: result.insertedId });
  });
});


// Launch ======================================================================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
