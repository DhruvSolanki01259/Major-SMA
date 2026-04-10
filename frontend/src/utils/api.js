import { useAuth } from "@clerk/clerk-react";

export const fetchProtectedData = async (getToken) => {
  const token = await getToken();

  const response = await fetch("http://localhost:5000/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
