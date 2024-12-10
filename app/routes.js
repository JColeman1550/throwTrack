module.exports = function(app, passport, db) {
  // Show the home page
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION - Ensure user is logged in
  app.get('/tracker', isLoggedIn, function(req, res) {
    db.collection('throws')
      .find()
      .toArray((err, result) => {
        if (err) return res.status(500).send('Error fetching throws.');
        res.render('tracker.ejs', {
          user: req.user,
          throws: result,
        });
      });
  });

  // LOGOUT - End session and redirect
  app.get('/logout', function(req, res) {
    req.logout(function() {
      console.log('User has logged out!');
    });
    res.redirect('/');
  });

  // POST route for saving pitch data
  app.post('/tracker', (req, res) => {
    const { strikeOrBall, zone, timestamp } = req.body;
    if (!strikeOrBall || !zone || !timestamp) {
      return res.status(400).send('Missing pitch data.');
    }

    db.collection('throws').insertOne({ strikeOrBall, zone, timestamp }, (err, result) => {
      if (err) return res.status(500).send('Error saving pitch data.');
      res.redirect('/tracker');
    });
  });

  // POST route for ending session
  app.post('/api/end-session', (req, res) => {
    const { pitchCount, ballCount, strikeCount, timestamp } = req.body;
    if (!pitchCount || !ballCount || !strikeCount || !timestamp) {
      return res.status(400).send('Missing required session data.');
    }

    db.collection('throws').insertOne({ pitchCount, ballCount, strikeCount, timestamp }, (err, result) => {
      if (err) return res.status(500).send('Error saving session data.');
      res.status(200).json(result.ops[0]);
    });
  });

  // DELETE route to remove specific pitch data
  app.delete('/tracker', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send('Missing pitch ID.');
    
    db.collection('throws').deleteOne({ _id: new require('mongodb').ObjectID(id) }, (err, result) => {
      if (err) return res.status(500).send('Error deleting pitch data.');
      res.send('Pitch data deleted!');
    });
  });

  // LOGIN - Show login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // Handle login form submission
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/tracker',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  // SIGNUP - Show signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // Handle signup form submission
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/tracker',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

  // UNLINK ACCOUNT - Unlink local account
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    req.user.local.email = undefined;
    req.user.local.password = undefined;
    req.user.save(function(err) {
      res.redirect('/tracker');
    });
  });
};

// Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
