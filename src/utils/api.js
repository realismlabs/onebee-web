import { generateWorkspaceIcon } from "./util";
import { useAuth } from "@clerk/nextjs";
//  this file holds several  the api calls for the app mocked to a local json server

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentUser = async (clerkUserId, headers) => {
  const response = await fetch(`${API_BASE_URL}/api/users/clerkUserId/${clerkUserId}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    }
  });

  if (!response.ok) {
    console.error("Error fetching current user", response);
    return null;
  }
  const result = await response.json();
  return result;
};

export const fetchCurrentWorkspace = async (workspaceId, headers) => {

  const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}`, {
    headers
  });
  if (!response.ok) {
    throw new Error("Error fetching current workspace");
  }

  const result = await response.json();
  return result;
};

// "/api/users/": "/users",
export const createUser = async ({ email, name, clerkUserId }) => {
  const requestBody = {
    email,
    name,
    clerkUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerified: false,
  };

  console.log("createUser requestBody", requestBody)

  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    return null;
    throw new Error("Error creating user");
  }
  const result = await response.json();
  return result;
}

export const createInvite = async ({
  workspaceId,
  inviterEmail,
  recipientEmail,
  jwt
}
) => {

  console.log("awu recipientEmail", recipientEmail)
  const recipientEmailCleaned = recipientEmail.trim();
  console.log("awu recipientEmailCleaned", recipientEmailCleaned)
  // first see if the recipient has already been invited or is already a member
  const existingInvites = await getInvitesForUserEmail(recipientEmailCleaned, jwt);
  const existingMemberships = await getWorkspaceMemberships(workspaceId, jwt);

  // for each existing membership, get the user details
  const existingUsers = await Promise.all(
    existingMemberships.map(async (membership) => {
      const user = await getUser(membership.userId, jwt);
      return user;
    })
  );

  const existingInvite = existingInvites.find(
    (invite) => invite.recipientEmail === recipientEmailCleaned && !invite.accepted && invite.workspaceId === workspaceId);

  const existingUser = existingUsers.find(
    (user) => user.email === recipientEmailCleaned
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
      `${API_BASE_URL}/api/workspaces/${workspaceId}/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          inviterEmail,
          recipientEmail: recipientEmailCleaned,
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

export const getInvitesForUserEmail = async (recipientEmail, jwt) => {
  console.log("getInvitesForUserEmail", recipientEmail);


  const encodedEmail = encodeURIComponent(recipientEmail);

  const response = await fetch(
    `${API_BASE_URL}/api/invites/recipient/${encodedEmail}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  // const response = await fetch(`${API_BASE_URL}/invites?recipientEmail=${recipientEmail}`);

  if (!response.ok) {
    throw new Error("Failed to fetch invites");
  }
  const result = await response.json();
  // only return invites that have not been accepted
  const filteredResult = result.filter((invite) => !invite.accepted);
  return filteredResult;
};

export const getWorkspaceInvites = async (workspaceId, jwt) => {


  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/invites`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invites for workspace: ${workspaceId}`);
  }

  const result = await response.json();
  // filter out accepted invites
  const filteredResult = result.filter((invite) => !invite.accepted);
  return filteredResult;
};

// "/api/workspaces/:workspaceId/invites/:inviteId/delete": "/invites/:inviteId",
export const deleteWorkspaceInvite = async ({ workspaceId, inviteId, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/invites/${inviteId}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const deletedInvite = await response.json();
  return deletedInvite;
};

// "/api/workspaces/:workspaceId/accept-invite/:inviteId": "/invites/:inviteId",
export const acceptWorkspaceInvite = async ({ workspaceId, inviteId, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/accept-invite/${inviteId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        accepted: true,
      }),
    }
  );
  const acceptedInvite = await response.json();
  return acceptedInvite;
};

// This is a public route that does not require authentication
export const getWorkspaceDetails = async (workspaceId) => {

  const response = await fetch(`${API_BASE_URL}/api/workspaces/${workspaceId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch workspace details for id: ${workspaceId}`);
  }
  return await response.json();
};

export const getUser = async (userId, jwt) => {

  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  });
  const user = await response.json();
  return user;
};

// Update a specific user
export const updateUser = async ({ userId, userData, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(userData),
    }
  );
  const updatedUser = await response.json();
  return updatedUser;
};


export const createWorkspace = async (workspaceData, jwt) => {

  const icon = generateWorkspaceIcon(workspaceData.name);

  const response = await fetch(`${API_BASE_URL}/api/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
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
export const updateWorkspace = async ({ workspaceId, workspaceData, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(workspaceData),
    }
  );
  const updatedWorkspace = await response.json();
  return updatedWorkspace;
};

// Delete workspace
export const deleteWorkspace = async ({ workspaceId, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const deletedWorkspace = await response.json();
  return deletedWorkspace;
};


// Get all tables associated with a workspace
export const getTables = async (workspaceId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const tables = await response.json();
  return tables;
};

// Get tables associated with a data_source in a workspace
export const getTablesFromDataSource = async (workspaceId, dataSourceId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources/${dataSourceId}/tables`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const tables = await response.json();
  console.log("getTablesFromDataSource", tables, workspaceId, dataSourceId)
  return tables;
};


// Create a table in a workspace
export const createTable = async (tableData, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${tableData.workspaceId}/tables`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(tableData),
    }
  );
  const createdTable = await response.json();
  return createdTable;
};

// Get a specific table in a workspace
export const getTable = async (workspaceId, tableId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables/${tableId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const table = await response.json();
  return table;
};

// Update a specific table in a workspace
export const updateTable = async ({ workspaceId, tableId, tableData, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables/${tableId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(tableData),
    }
  );
  const updatedTable = await response.json();
  return updatedTable;
};

// Delete a specific table in a workspace
export const deleteTable = async ({ workspaceId, tableId, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/tables/${tableId}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const deletedTable = await response.json();
  return deletedTable;
};

// Create a new data_source
export const createDataSource = async (workspaceId, dataSourceData, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(dataSourceData),
    }
  );
  const createdDataSource = await response.json();
  return createdDataSource;
};

// Get a specific data_source
export const getDataSource = async (workspaceId, dataSourceId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources/${dataSourceId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const data_source = await response.json();
  return data_source;
};

// get full details so that we can fetch tables from data source again
export const getDataSourceFull = async (workspaceId, dataSourceId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources/${dataSourceId}/full`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const data_source = await response.json();
  return data_source;
};
// Update a specific data_source, display name only
export const updateDataSourceDisplayName = async ({
  workspaceId,
  dataSourceId,
  data,
  jwt
}
) => {
  //  print all args
  console.log("updateDataSourceDisplayName", workspaceId, dataSourceId, data,)

  const displayName = data.name;

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources/${dataSourceId}/update_name`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ name: displayName }),
    }
  );
  const updatedDataSource = await response.json();
  console.log("updatedDataSource", updatedDataSource)
  return updatedDataSource;
};

// Update a specific data_source
export const updateDataSource = async ({
  workspaceId,
  dataSourceId,
  data,
  jwt
}
) => {
  //  print all args
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources/${dataSourceId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    }
  );
  const updatedDataSource = await response.json();
  console.log("updatedDataSource", updatedDataSource)
  return updatedDataSource;
};

// Delete a specific data_source
export const deleteDataSource = async ({ workspaceId, dataSourceId, jwt }) => {

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources/${dataSourceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting data source");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteDataSource:", error);
    throw error;
  }
};

// Get all data_sources associated with a workspace
export const getWorkspaceDataSources = async (workspaceId, jwt) => {
  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/data_sources`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const data_sources = await response.json();
  return data_sources;
};

// Get all data_sources associated with a workspace
export const getWorkspaces = async (jwt) => {

  console.log("getWorkspaces jwt", jwt)
  const response = await fetch(`${API_BASE_URL}/api/workspaces/`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    }
  );
  const data_sources = await response.json();
  return data_sources;
};


// create membership
export const createMembership = async (membershipData, jwt) => {

  // check first if user already has membership of this workspace

  const userId = membershipData.userId;
  const workspaceId = membershipData.workspaceId;

  const user_memberships = await getUserMemberships(userId, jwt);
  const user_memberships_workspaceIds = user_memberships.map((membership) => {
    return membership.workspaceId;
  });

  if (user_memberships_workspaceIds.includes(workspaceId)) {
    throw new Error("User already has membership of this workspace");
  }

  const response = await fetch(`${API_BASE_URL}/api/memberships`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(membershipData),
  });
  const createdMembership = await response.json();
  return createdMembership;
};

// "/api/memberships/:membershipId/update": "/memberships/:membershipId",
export const updateMembership = async ({ membershipId, membershipData, jwt }) => {

  console.log("updateMembership membershipId", membershipId)
  console.log("updateMembership membershipData", membershipData)

  const role = membershipData.role;

  const response = await fetch(
    `${API_BASE_URL}/api/memberships/${membershipId}/update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        role: role,
      }),
    }
  );
  const updatedMembership = await response.json();
  return updatedMembership;
};

// "/api/memberships/:membershipId/delete": "/memberships/:membershipId",
export const deleteMembership = async ({ membershipId, jwt }) => {

  const response = await fetch(
    `${API_BASE_URL}/api/memberships/${membershipId}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const deletedMembership = await response.json();
  return deletedMembership;
};

// "/api/workspaces/:workspaceId/memberships": "/memberships?workspaceId=:workspaceId",
export const getWorkspaceMemberships = async (workspaceId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/memberships`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  }
  );
  const memberships = await response.json();
  return memberships;
};

// "/api/users/:userId/memberships": "/memberships?userId=:userId"
export const getUserMemberships = async (userId, jwt) => {

  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/memberships`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  }
  );

  const memberships = await response.json();
  return memberships;
}

export const getAllowedWorkspacesForUser = async (userId, jwt) => {

  // fetch all workspaces
  const workspaces = await getWorkspaces(jwt);

  // fetch user email domain
  const user = await getUser(userId, jwt);

  const user_domain = user.email.split("@")[1].toLowerCase();

  // get the user's existing memberships
  const memberships = await getUserMemberships(userId, jwt);

  const invites = await getInvitesForUserEmail(user.email, jwt);

  // filter workspaces' allowedDomains array by email domain. 
  // Also filter out workspaces that the user is already a member of.
  // Also filter out workspaces that the user has been invited to.
  const allowedWorkspaces = workspaces.filter((workspace) => {
    const isMember = memberships.some((membership) => {
      return membership.workspaceId === workspace.id;
    });

    const isAllowedDomain = workspace.allowedDomains.some((domainObj) => {
      return domainObj.domain === user_domain;
    });

    const isInvited = invites.some((invite) => {
      return invite.workspaceId === workspace.id;
    });

    return isAllowedDomain && !isMember && !isInvited;
  });

  return allowedWorkspaces;
}

export const sendEmailInviteSendGrid = async ({ emailData
}) => {
  const {
    jwt,
    emailType,
    inviterName,
    inviterEmail,
    recipientEmail,
    // customMessage,
    workspaceName,
    workspaceLink,
    tableName,
    tableLink
  } = emailData;

  try {
    const response = await fetch(`${API_BASE_URL}/api/send-email-invite-teammate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        emailType,
        inviterName,
        inviterEmail,
        recipientEmail,
        // customMessage,
        workspaceName,
        workspaceLink,
        tableName,
        tableLink,
      }),
    });

    if (!response.ok) {
      throw new Error('Error: ' + response.statusText);
    }

    const data = await response.text();
    console.log('Email sent successfully: ', data);
  } catch (error) {
    console.error('Error:', error);
  }
};


export const sendEmailVerifyDomainSendGrid = async ({ emailData
}) => {
  const {
    jwt,
    recipientEmail,
    domain,
    settingsLink,
  } = emailData;

  try {
    const response = await fetch(`${API_BASE_URL}/api/send-email-verify-domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        recipientEmail,
        domain,
        settingsLink,
      }),
    });

    if (!response.ok) {
      throw new Error('Error: ' + response.statusText);
    }

    const data = await response.text();
    console.log('Email sent successfully: ', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const validateDomainVerificationCode = async (verificationRequestId, verificationCode, jwt) => {
  const response = await fetch(`${API_BASE_URL}/api/verify-domain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      verificationRequestId,
      verificationCode
    })
  });

  const data = await response.json();
  console.log('validateDomainVerificationCode data', data)
  return data.success;
}
