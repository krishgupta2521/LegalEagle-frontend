const API_BASE_URL = '/api';

export const fetchLawyers = async () => {
  try {
    console.log("Fetching lawyers from API...");
    const response = await fetch(`${API_BASE_URL}/lawyer`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Lawyers API response:", data);
    return data;
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

export const registerLawyer = async (lawyerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lawyer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lawyerData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store the authentication token if it exists in the response
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.lawyerId,
        name: lawyerData.name,
        email: lawyerData.email,
        role: 'lawyer'
      }));
    }
    
    return data;
  } catch (error) {
    console.error("Error registering lawyer:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store authentication info
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId || data.lawyerId,
        name: data.name,
        email: data.email,
        role: data.role
      }));
    }
    
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return response.ok;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
