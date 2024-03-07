const API_BASE_URL = 'http://localhost:5000'; // JSON Server주소

export const handler = async (userData: any) => {
  const data = {
    email: userData.email,
    password: userData.password,
  };

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to send user data to the server');
  }

  return response.json();
};
