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
  const response = await fetch(`${API_BASE_URL}/api/workspaces/1`);

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