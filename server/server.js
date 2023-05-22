const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');

  // Create users table
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT,
    name TEXT,
    clerkUserId TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    emailVerified INTEGER
)`, (err) => {
    if (err) {
      return console.log(err.message);
    }

    // Seed initial data
    db.run(`INSERT INTO users (email, name, clerkUserId, createdAt, updatedAt, emailVerified) VALUES 
    ('arthur+alpha@dataland.io', 'Arthur Wu', 'user_2PwdGxzs9QVxdiRL9hcBgL3geBA', '2023-04-26T02:52:46.736Z', '2023-04-26T02:52:46.736Z', 1)`, (err) => {
      if (err) {
        return console.log(err.message);
      }

      console.log('Users table created and initial data seeded');
    });
  });
});


// MIDDLEWARE
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  /* Here, you would normally verify the token with a method like jwt.verify(), then check if the
  user exists in your database. For simplicity's sake, we're just going to check if the token
  equals 'my-secret-token'. */

  if (token !== 'my-secret-token') return res.sendStatus(403);

  next(); // pass control to the next handler
}

app.get('/users', authenticate, (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});



// ROUTES
// Add your endpoints here
app.get('/users', authenticate, (req, res) => {
  /* Authentication middleware should be added here */

  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.listen(5002, () => {
  console.log('Server is running on port 5002');
});
