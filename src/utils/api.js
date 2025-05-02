const API_BASE_URL = '/api';

export const fetchLawyers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/lawyer`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    throw error;
  }
};

export const fetchWalletBalance = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
};
