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

// deletes entry
app.delete('/sessions', async (req, res) => {
  try {
      const { sessionId, sessionName, pitchCount, ballCount, strikeCount } = req.body;

      // Perform deletion logic (example: delete from database)
      const deletedSession = await session.findByIdAndDelete(sessionId);

      if (!deletedSession) {
          return res.status(404).send('Session not found');
      }

      // You could log the deleted data or perform any other necessary actions
      console.log(`Deleted session: ${sessionName}, Pitch Count: ${pitchCount}, Ball Count: ${ballCount}, Strike Count: ${strikeCount}`);

      res.status(200).send('Session deleted successfully');
  } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).send('Server error');
  }
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
