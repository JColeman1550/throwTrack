////////////////////////////////////////SET UP//////////////////////////////////////////////////////////////////
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
const ObjectId = mongoose.Types.ObjectId;

///////////////////////////////////CONFIGURATION///////////////////////////////////////////////////////////////////
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    require('./app/routes.js')(app, passport, mongoose.connection); // use mongoose.connection
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

///////////////////////////////////EXPRESS APP SETUP//////////////////////////////////////////////////////////////
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static('public'));

///////////////////////////////PASSPORT CONFIGURATION (SECURITY)////////////////////////////////////////////////

// ensure users only see their data

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

///////////////////////////////////////////API ROUTES///////////////////////////////////////////////////////////

//POST adding new session to DB
app.post('/sessions', (req, res) => {
  const { sessionName, sessionDate, pitchCount, strikeCount, ballCount } = req.body;

  // required fields
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
//////////////////////////////////////////////////////////////////////////////////////////////////

// GET fetch session data from DB
app.get('/pastsession', (req, res) => {
  mongoose.connection.db.collection('sessions').find().toArray((err, sessions) => {
    if (err) {
      console.error('Error fetching session data:', err);
      return res.status(500).send('Error fetching session data');
    }
    res.render('pastsession', { sessions });  // passes session to ejs page
  });
});

app.get('/pastsession', (req, res) => {
  mongoose.connection.db.collection('sessions').find().toArray((err, sessions) => {
    if (err) {
      console.error('Error fetching session data:', err);
      return res.status(500).send('Error fetching session data');
    }
    res.render('strikezonedata', { sessions }); 
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////

// PUT REQUEST

// increments pitch count
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

// PUT request to update a session
app.put('/pastsession', (req, res) => {
  const { id, sessionName, pitchCount, ballCount, strikeCount } = req.body;

  mongoose.connection.db.collection('sessions').findOneAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: {
        sessionName: sessionName,
        pitchCount: pitchCount,
        ballCount: ballCount,
        strikeCount: strikeCount
      }
    },
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        console.error('Failed to update session:', err);
        return res.status(500).send('Failed to update session');
      }
      res.status(200).send('Session updated successfully');
    }
  );
});


// PUT route to update strikezone data
app.put('/sessions/:id', (req, res) => {
  const sessionId = req.params.id;
  const { strikezoneData } = req.body;

  if (!strikezoneData) {
    return res.status(400).json({ message: 'Strikezone data is required' });
  }

  mongoose.connection.db.collection('sessions').updateOne(
    { _id: new mongoose.Types.ObjectId(sessionId) },
    { $set: { strikezoneData: strikezoneData } },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update strikezone data' });
      }
      res.status(200).json({ message: 'Strikezone data updated successfully' });
    }
  );
});





// decrements pitch count
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

// deletes entry
app.delete('/pastsession', (req, res) => {
  // Destructure the values from the request body
  const { id } = req.body;
  console.log("delete req", req.body);

  // Find and delete the document in the 'session' collection
  mongoose.connection.db.collection('sessions').findOneAndDelete({ _id: ObjectId(id) },
    (err, result) => {
      // If there is an error, send a 500 status with the error
      if (err) return res.send(500, err);

      // If successful, send a success message
      res.send('Message deleted!');
    }
  );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////

// new route to handle past session data (from frontend)
app.post('/pastsession', (req, res) => {
  const { sessionName, pitchCount, ballCount, strikeCount, strikezoneData, sessionEndedAt } = req.body;

  if (sessionName === undefined || pitchCount === undefined || ballCount === undefined || strikeCount === undefined || !strikezoneData) {
    return res.status(400).json({ message: 'Pitch count, ball count, strike count, and strike zone data are required' });
  }

  // puts session data into 'sessions' collection
  mongoose.connection.db.collection('sessions').insertOne({
    sessionName,
    pitchCount,
    ballCount,
    strikeCount,
    strikezoneData,
    sessionEndedAt,
    timestamp: new Date()
  }, (err, result) => {
    if (err) {
      console.error('Error adding session data:', err);
      return res.status(500).send('Error adding session data');
    }
    res.status(201).json({ message: 'Session data saved successfully', id: result.insertedId });
  });
});

////////////////////////////////////////LAUNCH/////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});