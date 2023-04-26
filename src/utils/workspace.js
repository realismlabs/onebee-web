const api_url = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentWorkspace = async () => {
  const response = await fetch(`${api_url}/api/workspaces/1`);

  if (!response.ok) {
    throw new Error('Error fetching current workspace');
  }

  return response.json();
};
