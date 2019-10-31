// implement your API here
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./data/db');
const path = require('path');

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'App works' });
});

app.post('/api/users', (req, res) => {
  const user = {
    name: req.body.name,
    bio: req.body.bio
  };
  if (!user.name || !user.bio) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user' });
  }
  db.insert(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(() => {
      res.status(500).json({
        error: 'There was an error while saving the user to the database'
      });
    });
});

app.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved' });
    });
});

app.get('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.findById(id)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user information could not be retrieved.' });
    });
});

app.delete('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.remove(id)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ error: 'The user could not be removed' });
    });
});

app.put('/api/users/:id', (req, res) => {
  let id = req.params.id;
  let updatedInfo = {
    name: req.body.name,
    bio: req.body.bio
  };
  if (!updatedInfo.name || !updatedInfo.bio) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  db.update(id, updatedInfo)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user information could not be modified.' });
    });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
