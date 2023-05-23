require('dotenv').config(); // To read CLERK_API_KEY
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const cors = require('cors');

const port = process.env.PORT || 5002;
const app = express();
app.use(express.json()); // The express.json() middleware is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on the body-parser module.

// app url is https://dataland-demo-995df.uc.r.appspot.com/api/users/clerkUserId/user_2QADjxJOASIi8uWWDd9SqUh1d0a

const allowedOrigins = ['http://localhost:3000', 'http://dataland.io', 'https://dataland.io', "https://onebee-web.vercel.app", "https://onebee-web-git-aw-express-realismlabs.vercel.app",];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    console.log("origin", origin)
    if (!origin) return callback(null, true);

    // allow any origin matching the pattern https://onebee-web-git-[whatever].vercel.app
    // This lets us use Vercel commit previews
    if (/^https:\/\/onebee-web-git-.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
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

// fetchCurrentUser
app.get('/api/users/clerkUserId/:clerkUserId', ClerkExpressRequireAuth(), async (req, res) => {
  const clerkUserId = req.params.clerkUserId;

  console.log("clerkUserId", clerkUserId)

  const client = await pool.connect();
  try {
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


// createUser
app.post('/api/users', ClerkExpressRequireAuth(), async (req, res) => {
  const { email, name, clerkUserId } = req.body;
  console.log("awus req.body", email, name, clerkUserId)

  const client = await pool.connect();
  try {
    // see if user already exists by clerkUserId
    const resultCheck = await client.query('SELECT * FROM users WHERE "clerkUserId" = $1', [clerkUserId]);
    console.log("awus resultCheck", JSON.stringify(resultCheck))
    const existingUser = resultCheck.rows[0];
    console.log("awus existingUser", JSON.stringify(existingUser))

    if (existingUser) {
      console.log("User already exists:", JSON.stringify(existingUser))
      res.status(400).json({ message: "User already exists" });
      return;
    }

    console.log("createUser", email, name, clerkUserId)

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const emailVerified = false;

    const result = await client.query(
      'INSERT INTO users (email, name, "clerkUserId", "createdAt", "updatedAt", "emailVerified") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [email, name, clerkUserId, createdAt, updatedAt, emailVerified]
    );
    const user = result.rows[0];

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  } finally {
    client.release();
  }
});

// createInvite
app.post('/api/workspaces/:workspaceId/invite', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const { inviterEmail, recipientEmail } = req.body;

  // here should be logic of checking if invite or membership already exists

  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO invites("inviterEmail", "recipientEmail", "workspaceId", accepted)
       VALUES($1, $2, $3, $4) RETURNING *`, [inviterEmail, recipientEmail, workspaceId, false]
    );

    const invite = result.rows[0];
    res.json(invite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating invite" });
  }
});

// getInvitesforUserEmail
app.get('/api/invites/recipient/:recipientEmail', ClerkExpressRequireAuth(), async (req, res) => {
  const recipientEmail = req.params.recipientEmail;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM invites WHERE "recipientEmail" = $1 AND accepted = false`, [recipientEmail]
    );

    const invites = result.rows;
    res.json(invites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching invites for user" });
  }
});

// getWorkspaceInvites
app.get('/api/workspaces/:workspaceId/invites', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM invites WHERE workspaceId = $1 AND accepted = false`, [workspaceId]
    );

    const invites = result.rows;
    res.json(invites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching workspace invites" });
  }
});

// deleteWorkspaceInvite
app.delete('/api/workspaces/:workspaceId/invites/:inviteId/delete', ClerkExpressRequireAuth(), async (req, res) => {
  const { workspaceId, inviteId } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM invites WHERE id = $1 AND workspaceId = $2 RETURNING *`, [inviteId, workspaceId]
    );
    const deletedInvite = result.rows[0];
    res.json(deletedInvite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting invite" });
  }
});

// acceptWorkspaceInvite
app.patch('/api/workspaces/:workspaceId/accept-invite/:inviteId', ClerkExpressRequireAuth(), async (req, res) => {
  const { workspaceId, inviteId } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE invites SET accepted = true WHERE id = $1 AND workspaceId = $2 RETURNING *`, [inviteId, workspaceId]
    );
    const acceptedInvite = result.rows[0];
    res.json(acceptedInvite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting invite" });
  }
});

// getWorkspaceDetails - note this is a public route
app.get('/api/workspaces/:workspaceId', async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM workspaces WHERE id = $1`, [workspaceId]);
    const workspace = result.rows[0];
    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching workspace details" });
  }
});


// getUser
app.get('/api/users/:userId', ClerkExpressRequireAuth(), async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// createWorkspace
app.post('/api/workspaces', ClerkExpressRequireAuth(), async (req, res) => {
  const { name, createdAt, creatorUserId, iconUrl } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query('INSERT INTO workspaces("name", "createdAt", "creatorUserId", "iconUrl") VALUES($1, $2, $3, $4) RETURNING *', [name, createdAt, creatorUserId, iconUrl]);
    const createdWorkspace = result.rows[0];
    res.json(createdWorkspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating workspace" });
  } finally {
    client.release();
  }
});

// updateWorkspace
app.patch('/api/workspaces/:workspaceId/update', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const { name, creatorUserId, iconUrl } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query('UPDATE workspaces SET "name"=$1, "creatorUserId"=$2, "iconUrl"=$3 WHERE id=$4 RETURNING *', [name, creatorUserId, iconUrl, workspaceId]);
    const updatedWorkspace = result.rows[0];
    res.json(updatedWorkspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating workspace" });
  } finally {
    client.release();
  }
});

// deleteWorkspace
app.delete('/api/workspaces/:workspaceId/delete', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  const client = await pool.connect();
  try {
    await client.query('DELETE FROM workspaces WHERE id=$1', [workspaceId]);
    res.json({ message: "Workspace deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting workspace" });
  } finally {
    client.release();
  }
});

// getTables
app.get('/api/workspaces/:workspaceId/tables', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tables WHERE "workspaceId"=$1', [workspaceId]);
    const tables = result.rows;
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting tables" });
  } finally {
    client.release();
  }
});


// getTablesFromConnection
app.get('/api/workspaces/:workspaceId/connections/:connectionId/tables', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const connectionId = parseInt(req.params.connectionId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tables WHERE "workspaceId"=$1 AND "connectionId"=$2', [workspaceId, connectionId]);
    const tables = result.rows;
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting tables from connection" });
  } finally {
    client.release();
  }
});


// createTable
app.post('/api/workspaces/:workspaceId/tables', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const { name, createdAt, createdByUserId, connectionId, sourceTableId } = req.body;

  console.log("Request body: ", req.body); // logging the body

  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO "tables"("name", "createdAt", "createdByUserId", "connectionId", "sourceTableId", "workspaceId") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, createdAt, createdByUserId, connectionId, sourceTableId, workspaceId]
    );
    const createdTable = result.rows[0];
    console.log('Created table', createdTable);
    res.json(createdTable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating table" });
  } finally {
    client.release();
  }
});


// getTable
app.get('/api/workspaces/:workspaceId/tables/:tableId', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const tableId = parseInt(req.params.tableId, 10);

  console.log("Request params: ", req.params); // logging the params

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM "tables" WHERE "workspaceId"=$1 AND "id"=$2', [workspaceId, tableId]);
    const table = result.rows[0];
    console.log('Fetched table', table);
    res.json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting table" });
  } finally {
    client.release();
  }
});


// updateTable
app.patch('/api/workspaces/:workspaceId/tables/:tableId/update', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const tableId = parseInt(req.params.tableId, 10);
  const { name, createdByUserId, connectionId, sourceTableId } = req.body;

  console.log("Request body: ", req.body); // logging the body

  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE "tables" SET "name"=$1, "createdByUserId"=$2, "connectionId"=$3, "sourceTableId"=$4 WHERE "workspaceId"=$5 AND "id"=$6 RETURNING *',
      [name, createdByUserId, connectionId, sourceTableId, workspaceId, tableId]
    );
    const updatedTable = result.rows[0];
    console.log('Updated table', updatedTable);
    res.json(updatedTable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating table" });
  } finally {
    client.release();
  }
});

// deleteTable
app.delete('/api/workspaces/:workspaceId/tables/:tableId/delete', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const tableId = parseInt(req.params.tableId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM "tables" WHERE "workspaceId"=$1 AND "id"=$2 RETURNING *', [workspaceId, tableId]);
    const deletedTable = result.rows[0];
    console.log('Deleted table', deletedTable);
    res.json(deletedTable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting table" });
  } finally {
    client.release();
  }
});

// createConnection
app.post('/api/workspaces/:workspaceId/connections', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const { name, host, port, database, username, password } = req.body;

  console.log("Request body: ", req.body); // logging the body

  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO "connections"("name", "host", "port", "database", "username", "password", "workspaceId") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, host, port, database, username, password, workspaceId]
    );
    const createdConnection = result.rows[0];
    console.log('Created connection', createdConnection);
    res.json(createdConnection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating connection" });
  } finally {
    client.release();
  }
});

// getConnection
app.get('/api/workspaces/:workspaceId/connections/:connectionId', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const connectionId = parseInt(req.params.connectionId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM "connections" WHERE "workspaceId"=$1 AND "id"=$2', [workspaceId, connectionId]);
    const connection = result.rows[0];
    console.log('Fetched connection', connection);
    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting connection" });
  } finally {
    client.release();
  }
});


// updateConnectionDisplayName
app.patch('/api/workspaces/:workspaceId/connections/:connectionId/update', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const connectionId = parseInt(req.params.connectionId, 10);
  const { name } = req.body;

  console.log("Request body: ", req.body); // logging the body

  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE "connections" SET "name"=$1 WHERE "workspaceId"=$2 AND "id"=$3 RETURNING *',
      [name, workspaceId, connectionId]
    );
    const updatedConnection = result.rows[0];
    console.log('Updated connection', updatedConnection);
    res.json(updatedConnection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating connection" });
  } finally {
    client.release();
  }
});

// deleteConnection
app.delete('/api/workspaces/:workspaceId/connections/:connectionId', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const connectionId = parseInt(req.params.connectionId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM "connections" WHERE "workspaceId"=$1 AND "id"=$2 RETURNING *', [workspaceId, connectionId]);
    const deletedConnection = result.rows[0];
    console.log('Deleted connection', deletedConnection);
    res.json(deletedConnection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting connection" });
  } finally {
    client.release();
  }
});

// getWorkspaceConnections
app.get('/api/workspaces/:workspaceId/connections', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM "connections" WHERE "workspaceId"=$1', [workspaceId]);
    const connections = result.rows;
    console.log('Fetched connections', connections);
    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting connections" });
  } finally {
    client.release();
  }
});

// createMembership
app.post('/api/memberships', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId, workspaceId } = req.body;

  console.log("Request body: ", req.body); // logging the body

  const client = await pool.connect();
  try {
    const membershipCheck = await client.query('SELECT * FROM "memberships" WHERE "userId"=$1 AND "workspaceId"=$2', [userId, workspaceId]);
    if (membershipCheck.rowCount > 0) {
      throw new Error("User already has membership of this workspace");
    }
    const result = await client.query('INSERT INTO "memberships"("userId", "workspaceId") VALUES($1, $2) RETURNING *', [userId, workspaceId]);
    const createdMembership = result.rows[0];
    console.log('Created membership', createdMembership);
    res.json(createdMembership);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});


// getWorkspaces
app.get('/api/workspaces/', ClerkExpressRequireAuth(), async (req, res) => {
  console.log("getWorkspaces request", req);
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM "workspaces"');
    const workspaces = result.rows;
    console.log('Fetched workspaces', workspaces);
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting workspaces" });
  } finally {
    client.release();
  }
});

// updateMembership
app.patch('/api/memberships/:membershipId/update', ClerkExpressRequireAuth(), async (req, res) => {
  const membershipId = parseInt(req.params.membershipId, 10);
  const membershipData = req.body;

  console.log("Request body: ", req.body); // logging the body

  const client = await pool.connect();
  try {
    const keys = Object.keys(membershipData).map((key, index) => `"${key}"=$${index + 1}`).join(', ');
    const values = Object.values(membershipData);
    const result = await client.query(`UPDATE "memberships" SET ${keys} WHERE "id"=$${values.length + 1} RETURNING *`, [...values, membershipId]);
    const updatedMembership = result.rows[0];
    console.log('Updated membership', updatedMembership);
    res.json(updatedMembership);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating membership" });
  } finally {
    client.release();
  }
});


// deleteMembership
app.delete('/api/memberships/:membershipId/delete', ClerkExpressRequireAuth(), async (req, res) => {
  const membershipId = parseInt(req.params.membershipId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM "memberships" WHERE "id"=$1 RETURNING *', [membershipId]);
    const deletedMembership = result.rows[0];
    console.log('Deleted membership', deletedMembership);
    res.json(deletedMembership);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting membership" });
  } finally {
    client.release();
  }
});

// getWorkspaceMemberships
app.get('/api/workspaces/:workspaceId/memberships', ClerkExpressRequireAuth(), async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM "memberships" WHERE "workspaceId"=$1', [workspaceId]);
    const memberships = result.rows;
    console.log('Fetched memberships', memberships);
    res.json(memberships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting memberships" });
  } finally {
    client.release();
  }
});


// getUserMemberships
app.get('/api/users/:userId/memberships', ClerkExpressRequireAuth(), async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM "memberships" WHERE "userId"=$1', [userId]);
    const memberships = result.rows;
    console.log('Fetched memberships', memberships);
    res.json(memberships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting memberships" });
  } finally {
    client.release();
  }
});


// Catch errors from ClerkExpressRequireAuth
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('awu: Unauthenticated, no valid JWT found in request headers');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
