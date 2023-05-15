import { generateIcon } from "./util";
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
  console.log("fetchCurrentWorkspace", response);

  if (!response.ok) {
    throw new Error("Error fetching current workspace");
  }

  const result = await response.json();
  console.log("fetchCurrentWorkspace", result);
  return result;
};

export const getInvitesForUserEmail = async (recipientEmail) => {
  console.log("getInvitesForUserEmail", recipientEmail);
  const response = await fetch(
    `${API_BASE_URL}/api/invites/recipient/${recipientEmail}`
  );
  // const response = await fetch(`${API_BASE_URL}/invites?recipient_email=${recipientEmail}`);

  if (!response.ok) {
    throw new Error("Failed to fetch invites");
  }
  return await response.json();
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
  const icon = generateIcon(workspaceData.name);

  const response = await fetch(`${API_BASE_URL}/api/workspaces/create`, {
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
  console.log("getTables", tables, workspaceId)
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
    `${API_BASE_URL}/api/workspaces/${tableData.workspaceId}/tables/create`,
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
    `${API_BASE_URL}/api/workspaces/${workspaceId}/connections/create`,
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
