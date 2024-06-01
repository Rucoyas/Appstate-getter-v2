const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3030;

app.use(express.static('public'));

app.get('/appstate', async (req, res) => {
  const email = req.query.e;
  const password = req.query.p;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password query parameters are required' });
  }

  try {
    const response = await axios.get(`https://fca-base-appstate.replit.app/shiki?email=${email}&password=${password}`);

    if (response.data.error) {
      return res.status(401).send({ error: response.data.error });
    }

    res.type('json').send(response.data);
  } catch (err) {
    console.error('Error in axios request:', err);
    res.status(401).send({ error: 'Authentication failed. Please check your email and password.' });
  }
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
