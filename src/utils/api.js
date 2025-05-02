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

export const fetchWalletBalance = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/wallet/${user.id}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
};

export const addMoneyToWallet = async (amount) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/wallet/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ userId: user.id, amount })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error adding money to wallet:", error);
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

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
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
        id: data.userId,
        name: userData.name,
        email: userData.email,
        role: 'user'
      }));
    }
    
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
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

export const bookAppointment = async (lawyerId, date, time, notes = '') => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        userId: user.id,
        lawyerId,
        date,
        time,
        notes
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

export const createChatRoom = async (lawyerId) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        userId: user.id,
        lawyerId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

export const getChatHistory = async (chatId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const getUserChats = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/chat/user/${user.id}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
};
