require('dotenv').config(); // To read CLERK_API_KEY
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const cors = require('cors');

const port = process.env.PORT || 5002;
const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://dataland.io', 'https://dataland.io'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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

// get user by clerkUserId
app.get('/api/users/clerkUserId/:clerkUserId', ClerkExpressRequireAuth(), async (req, res) => {
  const clerkUserId = req.params.clerkUserId;

  console.log("clerkUserId", clerkUserId)

  const client = await pool.connect();
  try {
    const result1 = await client.query('SELECT * FROM users');
    console.log("result1", result1.rows);

    const result = await client.query('SELECT * FROM users WHERE "clerkUserId" = $1', [clerkUserId]);
    const user = result.rows[0];

    if (!user) {
      console.error("Error fetching current user", result);
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching current user" });
  } finally {
    client.release();
  }
});

// fetchCurrentWorkspace 
app.get('/api/workspaces/:workspaceId', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM workspaces WHERE "id" = $1', [workspaceId]);
    const workspace = result.rows[0];

    if (!workspace) {
      console.error("Error fetching current workspace", result);
      res.status(404).json({ message: "Workspace not found" });
      return;
    }

    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching current workspace" });
  } finally {
    client.release();
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
