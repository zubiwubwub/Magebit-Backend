const path = require('path');
const express = require('express');

const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'email_list',
});

// create an email

app.post('/create', (req, res) => {
  const address = req.body.address;
  console.log(address);
  const provider = req.body.address.split('@').pop();
  db.query(
    'INSERT INTO emails (address, provider) VALUES (?,?)',
    [address, provider],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Email Inserted');
        console.log(result);
      }
    }
  );
});

//Get a list of emails
app.get('/emails', (req, res) => {
  db.query('SELECT * FROM emails', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Delete an email
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM emails WHERE id = ?', id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Order by name
app.get('/emails/byaddress', (req, res) => {
  db.query('SELECT * FROM emails ORDER BY address', function (err, result) {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
});

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
