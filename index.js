const appstate = require('fca-project-orion');
const express = require('express');
const path = require('path');
const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Serve static files (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/appstate', (req, res) => {
  const email = req.query.e;
  const password = req.query.p;

  if (!email || !password) {
    return res.status(400).send('Email and password query parameters are required');
  }

  appstate({ email, password }, (err, api) => {
    if (err) {
      console.error('Error in appstate:', err);
      // Adjust the response to send the error message
      return res.status(401).send(err.error || 'Authentication failed');
    } else {
      try {
        const result = api.getAppState();  // Correctly getting the app state
        res.send(result);
      } catch (err) {
        console.error('Error getting app state:', err);
        res.status(500).send('Internal Server Error');
      }
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
