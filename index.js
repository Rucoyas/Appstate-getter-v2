const express = require('express');
const fb = require("fbkey");
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3030;

app.use(express.static('public'));

app.get('/appstate', async (req, res) => {
  const email = req.query.e;
  const password = req.query.p;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password query parameters are required' });
  }

  const filename = 'appstate.json';

  // Check if appstate.json already exists
  if (fs.existsSync(filename)) {
    return res.status(400).send({ error: 'appstate.json already exists' });
  }

  try {
    const facebook = await fb.getAppstate(email, password);
    const results = JSON.stringify(facebook, null, 2);

    fs.writeFileSync(filename, results);
    console.log('[FBKEY] > Currently logged in...');

    res.type('json').send({ success: results });

    setTimeout(() => {
      fs.unlink(filename, (err) => {
        if (err) {
          console.error('Error deleting appstate.json:', err);
        } else {
          console.log('appstate.json deleted successfully');
        }
      });
    }, 16000);
  } catch (err) {
    console.error('Error in fbkey:', err);
    res.status(401).send({ error: err.message });
  }
});

app.get('/file', (req, res) => {
  const src = req.query.src;

  if (!src) {
    return res.status(400).send({ error: 'src query parameter is required' });
  }

  const filePath = path.resolve(__dirname, src);

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('File access error:', err);
      return res.status(404).send({ error: 'File not found or inaccessible' });
    }

    res.sendFile(filePath);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
