import api from "../api";

export async function fetchAuthorById(authorId) {
  try {
    const response = await api.get(`/users/author/${authorId}`);  
    console.log("Fetched author response:", response);
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch author:", error);
    throw error;
  }
}
