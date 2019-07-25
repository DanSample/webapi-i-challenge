const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

// implement your API here
// POST /api/users Creates a user using the information sent inside the request body.
// GET /api/users Returns an array of all the user objects contained in the database.
// GET /api/users/:id Returns the user object with the specified id.
// DELETE /api/users/:id Removes the user with the specified id and returns the deleted user.
// PUT /api/users/:id Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.

//POST

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    db.insert({ name, bio })
      .then(user => {
        res.status(201).json({ success: true, user });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          err,
          errorMessage: 'Please provide name and bio for the user.'
        });
      });
  }
});

//GET

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.', err });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          success: false,
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: 'The user information could not be retrieved.',
        err
      });
    });
});

//DELETE

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: 'The user could not be removed',
        err
      });
    });
});

//PUT

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const userInfo = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    db.update(id, userInfo)
      .then(user => {
        if (user) {
          res.status(200).json({
            success: true,
            message: 'The user has been successfully updated',
            user
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'The user with the specified ID does not exist.'
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          success: false,
          errorMessage: 'The user information could not be modified.'
        });
      });
  }
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
