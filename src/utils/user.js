const api_url = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentUser = async () => {
  const response = await fetch(`${api_url}/api/users/1`);

  if (!response.ok) {
    throw new Error('Error fetching current user');
  }

  return response.json();
};
