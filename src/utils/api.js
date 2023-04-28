import { generateIcon } from "./util";
//  this file holds several  the api calls for the app mocked to a local json server

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/1`);

  if (!response.ok) {
    throw new Error('Error fetching current user');
  }

  return response.json();
};

export const fetchCurrentWorkspace = async () => {
  const response = await fetch(`${API_BASE_URL}/api/workspaces/6`);

  if (!response.ok) {
    throw new Error('Error fetching current workspace');
  }

  return response.json();
};


export const getInvitesForUserEmail = async (recipientEmail) => {
  console.log('getInvitesForUserEmail', recipientEmail)
  const response = await fetch(`${API_BASE_URL}/api/invites/recipient/${recipientEmail}`);
  // const response = await fetch(`${API_BASE_URL}/invites?recipient_email=${recipientEmail}`);

  if (!response.ok) {
    throw new Error('Failed to fetch invites');
  }
  return await response.json();
}

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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...workspaceData,
      iconUrl: icon
    })
  });
  const createdWorkspace = await response.json();
  return createdWorkspace;
};