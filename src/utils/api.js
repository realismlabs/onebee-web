import { generateWorkspaceIcon } from "./util";
//  this file holds several  the api calls for the app mocked to a local json server

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/1`);
  if (!response.ok) {
    throw new Error("Error fetching current user");
  }
  return response.json();
};

export const fetchCurrentWorkspace = async (workspaceId) => {
  const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}`);
  if (!response.ok) {
    throw new Error("Error fetching current workspace");
  }

  const result = await response.json();
  return result;
};

export const createInvite = async ({
  workspaceId,
  inviterEmail,
  recipientEmail
}
) => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  // first see if the recipient has already been invited or is already a member
  const existingInvites = await getInvitesForUserEmail(recipientEmail.trim());
  const existingMemberships = await getWorkspaceMemberships(workspaceId);

  // for each existing membership, get the user details
  const existingUsers = await Promise.all(
    existingMemberships.map(async (membership) => {
      const user = await getUser(membership.userId);
      return user;
    })
  );

  const existingInvite = existingInvites.find(
    (invite) => invite.recipientEmail === recipientEmail.trim()
  );

  const existingUser = existingUsers.find(
    (user) => user.email === recipientEmail.trim()
  );

  if (existingInvite) {
    console.log("Invite already exists:", existingInvite);
    throw new Error("user_already_invited");
  }

  if (existingUser) {
    console.log("User is already a member:", existingUser);
    throw new Error("user_already_member");
  }

  try {
    const response = await fetch(
      `${api_url}/api/workspaces/${workspaceId}/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviterEmail,
          recipientEmail,
          accepted: false,
          workspaceId: workspaceId,
        }),
      }
    );

    if (response.ok) {
      const invite = await response.json();
      console.log("Invite created:", invite);
      return invite;
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};


export const getInvitesForUserEmail = async (recipientEmail) => {
  console.log("getInvitesForUserEmail", recipientEmail);
  const response = await fetch(
    `${API_BASE_URL}/api/invites/recipient/${recipientEmail}`
  );
  // const response = await fetch(`${API_BASE_URL}/invites?recipientEmail=${recipientEmail}`);

  if (!response.ok) {
    throw new Error("Failed to fetch invites");
  }
  const result = await response.json();
  console.log("getInvitesForUserEmail result", result);
  return result;
};

// "/api/workspaces/:workspaceId/invites": "/invites?workspaceId=:workspaceId",
export const getWorkspaceInvites = async (workspaceId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/invites`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invites for workspace: ${workspaceId}`);
  }
  return await response.json();
};

// "/api/workspaces/:workspaceId/invites/:inviteId/delete": "/invites/:inviteId",
export const deleteWorkspaceInvite = async ({ workspaceId, inviteId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/invites/${inviteId}/delete`,
    {
      method: "DELETE",
    }
  );
  const deletedInvite = await response.json();
  return deletedInvite;
};

export const getWorkspaceDetails = async (workspaceId) => {
  const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch workspace details for id: ${workspaceId}`);
  }
  return await response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users`);
  }
  return await response.json();
};

export const getUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
  const user = await response.json();
  return user;
};


// Update a specific user
export const updateUser = async ({ userId, userData }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  const updatedUser = await response.json();
  return updatedUser;
};

// Example usage + request body
// const workspaceData = {
//   name: 'My New Workspace',
//   createdAt: '2023-04-27T12:00:00Z',
//   creatorUserId: '123',
//   iconUrl: 'https://example.com/icon.png'
// };
// createWorkspace(workspaceData)
//   .then((createdWorkspace) => {
//     console.log('Created workspace:', createdWorkspace);
//   })
//   .catch((error) => {
//     console.error('Error creating workspace:', error);
//   });

export const createWorkspace = async (workspaceData) => {
  const icon = generateWorkspaceIcon(workspaceData.name);

  const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...workspaceData,
      iconUrl: icon,
    }),
  });
  const createdWorkspace = await response.json();
  return createdWorkspace;
};

// Update a specific workspace
export const updateWorkspace = async ({ workspaceId, workspaceData }) => {
  console.log("awu here")
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workspaceData),
    }
  );
  const updatedWorkspace = await response.json();
  return updatedWorkspace;
};

// Delete workspace
export const deleteWorkspace = async ({ workspaceId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/delete`,
    {
      method: "DELETE",
    }
  );
  const deletedWorkspace = await response.json();
  return deletedWorkspace;
};


// Get all tables associated with a workspace
export const getTables = async (workspaceId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables`
  );
  const tables = await response.json();
  return tables;
};

// Get tables associated with a connection in a workspace
export const getTablesFromConnection = async (workspaceId, connectionId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/connections/${connectionId}/tables`
  );
  const tables = await response.json();
  console.log("getTablesFromConnection", tables, workspaceId, connectionId)
  return tables;
};


// Create a table in a workspace
export const createTable = async (tableData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${tableData.workspaceId}/tables`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    }
  );
  const createdTable = await response.json();
  return createdTable;
};

// Get a specific table in a workspace
export const getTable = async (workspaceId, tableId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables/${tableId}`
  );
  const table = await response.json();
  return table;
};

// Update a specific table in a workspace
export const updateTable = async ({ workspaceId, tableId, tableData }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables/${tableId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    }
  );
  const updatedTable = await response.json();
  return updatedTable;
};

// Delete a specific table in a workspace
export const deleteTable = async ({ workspaceId, tableId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables/${tableId}/delete`,
    {
      method: "DELETE",
    }
  );
  const deletedTable = await response.json();
  return deletedTable;
};

// Create a new connection
export const createConnection = async (workspaceId, connectionData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/connections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(connectionData),
    }
  );
  const createdConnection = await response.json();
  return createdConnection;
};

// Get a specific connection
export const getConnection = async (workspaceId, connectionId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/connections/${connectionId}`
  );
  const connection = await response.json();
  return connection;
};

// Update a specific connection
export const updateConnectionDisplayName = async ({
  workspaceId,
  connectionId,
  data,
}
) => {
  //  print all args
  console.log("updateConnectionDisplayName", workspaceId, connectionId, data)

  const displayName = data.name;

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/connections/${connectionId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: displayName }),
    }
  );
  const updatedConnection = await response.json();
  console.log("updatedConnection", updatedConnection)
  return updatedConnection;
};

// Delete a specific connection
export const deleteConnection = async ({ workspaceId, connectionId }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/workspaces/${workspaceId}/connections/${connectionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting connection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteConnection:", error);
    throw error;
  }
};

// Get all connections
export const getConnections = async () => {
  const response = await fetch(`${API_BASE_URL}/api/connections`);
  const connections = await response.json();
  return connections;
};

// Get all connections associated with a workspace
export const getWorkspaceConnections = async (workspaceId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/connections`
  );
  const connections = await response.json();
  return connections;
};

// Get all connections associated with a workspace
export const getWorkspaces = async () => {
  const response = await fetch(`${API_BASE_URL}/api/workspaces/`);
  const connections = await response.json();
  return connections;
};

export const getWorkspace = async (workspaceId) => {
  const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}`);
  const workspace = await response.json();
  return workspace;
};

// "/api/memberships": "/memberships",
export const getMemberships = async () => {
  const response = await fetch(`${API_BASE_URL}/api/memberships`);
  const memberships = await response.json();
  return memberships;
};

// "/api/memberships/:membershipId": "/memberships/:membershipId",
export const getMembership = async (membershipId) => {
  const response = await fetch(`${API_BASE_URL}/api/memberships/${membershipId}`);
  const membership = await response.json();
  return membership;
};

// create membership
export const createMembership = async (membershipData) => {
  const response = await fetch(`${API_BASE_URL}/api/memberships`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(membershipData),
  });
  const createdMembership = await response.json();
  return createdMembership;
};

// "/api/memberships/:membershipId/update": "/memberships/:membershipId",
export const updateMembership = async ({ membershipId, membershipData }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/memberships/${membershipId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(membershipData),
    }
  );
  const updatedMembership = await response.json();
  return updatedMembership;
};

// "/api/memberships/:membershipId/delete": "/memberships/:membershipId",
export const deleteMembership = async ({ membershipId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/memberships/${membershipId}/delete`,
    {
      method: "DELETE",
    }
  );
  const deletedMembership = await response.json();
  return deletedMembership;
};

// "/api/workspaces/:workspaceId/memberships": "/memberships?workspaceId=:workspaceId",
export const getWorkspaceMemberships = async (workspaceId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/memberships`
  );
  const memberships = await response.json();
  return memberships;
};

// "/api/users/:userId/memberships": "/memberships?userId=:userId"
export const getUserMemberships = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/memberships`
  );
  const memberships = await response.json();
  return memberships;
}
