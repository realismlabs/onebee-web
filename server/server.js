require('dotenv').config(); // To read CLERK_API_KEY
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');


const port = process.env.PORT || 5002;
const app = express();

const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'db.htnkbjjakwynjxocwsll.supabase.co',
  database: 'postgres',
  password: '7mUMCMFCAw4Cc2bc',
  port: 6543,
});

app.get('/users', ClerkExpressRequireAuth(), async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    res.send(result.rows);
  } finally {
    client.release();
  }
});

// Use the strict middleware that raises an error when unauthenticated
app.get(
  '/protected-endpoint',
  ClerkExpressRequireAuth(),
  (req, res) => {
    res.json(req.auth);
  }
);

app.get(
  '/user',
  ClerkExpressRequireAuth(),
  (req, res) => {
    res.json({ message: "You're authenticated!" });
  }
);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
