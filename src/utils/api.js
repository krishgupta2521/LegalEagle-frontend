const API_BASE_URL = 'https://legal-eagle-backend.vercel.app/api'; 

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
    const API_BASE_URL = 'http://localhost:/api';
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
    console.log("Lawyer registration response:", data);
    
    // Store the authentication token if it exists
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.lawyerId,
        lawyerId: data.lawyerId,
        name: lawyerData.name,
        email: lawyerData.email,
        role: 'lawyer',
        source: 'lawyer'
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
    // Always include checkBoth and isLawyerLogin parameters
    const modifiedCredentials = {
      ...credentials,
      checkBoth: true,
      isLawyerLogin: true
    };
    
    console.log("Sending login request with credentials:", {
      email: modifiedCredentials.email,
      checkBoth: modifiedCredentials.checkBoth,
      isLawyerLogin: modifiedCredentials.isLawyerLogin
    });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedCredentials)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`Login failed with status: ${response.status} - ${errorText}`);
      }
      
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    const userData = await response.json();
    console.log("Login success response:", userData);
    
    // Store the authentication token and user data
    localStorage.setItem('authToken', userData.token);
    
    // Ensure all necessary user data is included
    const userToStore = {
      id: userData.userId,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'lawyer',
      source: userData.source || 'lawyer',
      lawyerId: userData.lawyerId || userData.userId
    };
    
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    return userData;
  } catch (error) {
    console.error("Error logging in:", error);
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
  if (!token) {
    console.warn("No auth token found in localStorage");
    return {};
  }
  return { 'Authorization': `Bearer ${token}` };
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
    
    console.log("Creating chat room for lawyer:", lawyerId, "as user:", user.id);
    
    // Get auth headers
    const headers = getAuthHeaders();
    
    // Try to create the chat room
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        userId: user.id,
        lawyerId,
        forceCreation: false // Don't bypass appointment check
      })
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to create chat room: ${response.status} - ${responseText}`);
      }
      
      if (errorData.code === 'NO_APPOINTMENT') {
        throw new Error('You must have a paid appointment with this lawyer to start a chat');
      }
      
      throw new Error(errorData.error || `Failed to create chat room: ${response.status}`);
    }
    
    const chatData = await response.json();
    console.log("Chat room created/retrieved successfully:", chatData._id);
    return chatData;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

export const getChatHistory = async (chatId) => {
  try {
    console.log("Fetching chat history for:", chatId);
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      let errorMessage;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || `HTTP error! Status: ${response.status}`;
      } catch (e) {
        errorMessage = `Failed to fetch chat history: ${response.status} - ${responseText}`;
      }
      
      console.error("Chat history error:", errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Retrieved chat history with messages:", data.messages?.length || 0);
    return data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const getUserChats = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    console.log("Fetching chats for user:", user.id);
    
    // Use direct URL to avoid routing conflicts
    const API_BASE_URL = 'https://legal-eagle-backend.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/chat/user/${user.id}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      // If 404, just return empty array instead of throwing error
      if (response.status === 404) {
        console.log('No chats found for user, returning empty array');
        return [];
      }
      
      const errorText = await response.text();
      console.error(`Failed to fetch user chats: ${response.status}`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`Failed to fetch user chats: ${response.status} - ${errorText}`);
      }
      
      throw new Error(errorData.error || `Failed to fetch user chats: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully retrieved ${data.length} chats for user ${user.id}`);
    return data;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
};

export const getLawyerChats = async (lawyerId) => {
  try {
    console.log(`Fetching chats for lawyer: ${lawyerId}`);
    
    // Use direct URL to avoid routing conflicts
    const API_BASE_URL = 'https://legal-eagle-backend.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/chat/lawyer/${lawyerId}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      // If 404, just return empty array instead of throwing error
      if (response.status === 404) {
        console.log('No chats found for lawyer, returning empty array');
        return [];
      }
      
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP error! Status: ${response.status}` 
      }));
      throw new Error(errorData.error || `Failed to fetch lawyer chats: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully retrieved ${data.length} chats for lawyer ${lawyerId}`);
    return data;
  } catch (error) {
    console.error("Error fetching lawyer chats:", error);
    throw error;
  }
};

export const sendMessageToChat = async (chatId, text, sender) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ text, sender })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const markChatAsRead = async (chatId, reader) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ reader })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error marking chat as read:", error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/wallet/${user.id}/transactions`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
