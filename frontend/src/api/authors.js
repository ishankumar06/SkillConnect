import api from "../api"; // adjust path

export async function fetchAuthorById(authorId) {
  try {
    const response = await api.get(`/users/${authorId}`);  // Use /users/:id here
    return response.data; // author data expected here
  } catch (error) {
    console.error("Failed to fetch author:", error);
    throw error;
  }
}
