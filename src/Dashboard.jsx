import React, { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { LogOut, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./utils/authContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    initSocket, 
    authenticateSocket, 
    joinChatRoom, 
    sendMessage, 
    onReceiveMessage, 
    disconnectSocket 
} from "./utils/socket";
import { getLawyerChats, getChatHistory, getAuthHeaders } from "./utils/api";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Chat component error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-white rounded-xl p-6 shadow">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h3>
                    <p className="mb-4 text-gray-700">There was an error loading the chat interface.</p>
                    <details className="text-sm text-gray-500 mb-4">
                        <summary>Error details</summary>
                        <p>{this.state.error && this.state.error.toString()}</p>
                    </details>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        className="bg-[#0B0B5C] text-white px-4 py-2 rounded-md"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default function LawyerDashboard() {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        todayBookings: 0,
        totalClients: 0,
        pendingReviews: 0,
        totalEarnings: 0,
        caseStatus: {
            newCases: 0,
            ongoingCases: 0,
            pendingReview: 0,
            resolvedCases: 0
        },
        appointments: [],
        recentClients: [],
        earningsData: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const dropdownRef = useRef();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                
                const lawyerId = user.source === 'lawyer' ? user.id : user.lawyerId;
                
                if (!lawyerId && user.source !== 'lawyer') {
                    try {
                        const response = await fetch(`/api/lawyer/user/${user.id}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error('Failed to fetch lawyer profile');
                        }
                        
                        const lawyerProfile = await response.json();
                        const fetchedLawyerId = lawyerProfile._id;
                        
                        const updatedUser = { ...user, lawyerId: fetchedLawyerId };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        
                        fetchDashboardDetails(fetchedLawyerId);
                    } catch (error) {
                        console.error("Error fetching lawyer profile:", error);
                        setLoading(false);
                    }
                } else {
                    fetchDashboardDetails(lawyerId);
                }
                
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };
        
        const fetchDashboardDetails = async (lawyerId) => {
            try {
                if (!lawyerId) {
                    console.error("No lawyer ID provided to fetchDashboardDetails");
                    setLoading(false);
                    return;
                }

                console.log("Fetching appointments for lawyer:", lawyerId);
                const appointmentsResponse = await fetch(`/api/appointments/lawyer/${lawyerId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (!appointmentsResponse.ok) {
                    const errorText = await appointmentsResponse.text();
                    console.error("Appointments response error:", errorText);
                    throw new Error(`Failed to fetch appointments: ${appointmentsResponse.status}`);
                }
                
                const appointments = await appointmentsResponse.json();
                console.log("Fetched appointments:", appointments.length);
                
                // Try to fetch chats but don't fail if this part errors
                let chats = [];
                try {
                    console.log("Fetching chats for lawyer:", lawyerId);
                    const chatsResponse = await fetch(`/api/chat/lawyer/${lawyerId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                    
                    if (chatsResponse.ok) {
                        chats = await chatsResponse.json();
                        console.log("Fetched chats:", chats.length);
                    } else {
                        console.warn("Failed to fetch chats, but continuing with appointments data");
                    }
                } catch (chatError) {
                    console.warn("Error fetching chats, but continuing:", chatError);
                }
                
                // Process the appointments data even if chat data failed
                const today = new Date().toISOString().split('T')[0];
                const todayAppointments = appointments.filter(app => app.date === today);
                
                const uniqueClientIds = [...new Set(appointments.map(app => app.userId?._id))];
                
                const totalEarnings = appointments
                    .filter(app => app.isPaid && app.status !== 'cancelled')
                    .reduce((sum, app) => sum + (app.amount || 0), 0);
                
                const recentClients = appointments
                    .filter((app, index, self) => 
                        index === self.findIndex(a => (a.userId?._id === app.userId?._id))
                    )
                    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                    .slice(0, 5);
                
                const earningsData = generateMonthlyEarningsData(appointments);
                
                setDashboardData({
                    todayBookings: todayAppointments.length,
                    totalClients: uniqueClientIds.length,
                    pendingReviews: 0,
                    totalEarnings,
                    caseStatus: {
                        newCases: appointments.filter(app => app.status === 'pending').length,
                        ongoingCases: appointments.filter(app => app.status === 'confirmed').length,
                        pendingReview: 0,
                        resolvedCases: appointments.filter(app => app.status === 'completed').length
                    },
                    appointments: todayAppointments.slice(0, 3),
                    recentClients,
                    earningsData
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard details:", error);
                
                // Set default data to prevent UI errors
                setDashboardData({
                    todayBookings: 0,
                    totalClients: 0,
                    pendingReviews: 0,
                    totalEarnings: 0,
                    caseStatus: {
                        newCases: 0,
                        ongoingCases: 0,
                        pendingReview: 0,
                        resolvedCases: 0
                    },
                    appointments: [],
                    recentClients: [],
                    earningsData: generateDefaultEarningsData()
                });
                
                setLoading(false);
            }
        };
        
        const generateDefaultEarningsData = () => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentMonth = new Date().getMonth();
            
            const earningsData = [];
            for (let i = 5; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                earningsData.push({
                    name: months[monthIndex],
                    earnings: 0
                });
            }
            
            return earningsData;
        };
        
        const generateMonthlyEarningsData = (appointments) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentMonth = new Date().getMonth();
            
            const earningsData = [];
            for (let i = 5; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                earningsData.push({
                    name: months[monthIndex],
                    earnings: 0
                });
            }
            
            appointments.forEach(app => {
                if (app.isPaid && app.status !== 'cancelled') {
                    const appDate = new Date(app.createdAt || app.date);
                    const monthIndex = appDate.getMonth();
                    const monthName = months[monthIndex];
                    
                    const dataIndex = earningsData.findIndex(item => item.name === monthName);
                    if (dataIndex !== -1) {
                        earningsData[dataIndex].earnings += (app.amount || 0);
                    }
                }
            });
            
            return earningsData;
        };
        
        fetchDashboardData();
    }, [user]);
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!user || user.role !== 'lawyer') {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                <p className="mb-4">You must be logged in as a lawyer to view this page.</p>
                <Link to="/login" className="bg-[#0B0B5C] text-white px-6 py-2 rounded-full">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-6 gap-6 bg-gray-50 min-h-screen text-sm">
            <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow flex flex-col space-y-4">
                <div className="font-bold text-lg">LEGAL EAGLE</div>
                <nav className="space-y-2">
                    <div 
                        onClick={() => setActiveTab('overview')} 
                        className={`hover:text-blue-600 cursor-pointer ${activeTab === 'overview' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                        Dashboard
                    </div>
                    <div 
                        onClick={() => setActiveTab('chats')} 
                        className={`hover:text-blue-600 cursor-pointer ${activeTab === 'chats' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                        Chat Messages
                    </div>
                    <div 
                        onClick={() => setActiveTab('cases')} 
                        className={`hover:text-blue-600 cursor-pointer ${activeTab === 'cases' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                        Cases
                    </div>
                    <div 
                        onClick={() => setActiveTab('reviews')} 
                        className={`hover:text-blue-600 cursor-pointer ${activeTab === 'reviews' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                        Reviews
                    </div>
                </nav>
            </div>

            <div className="lg:col-span-5 grid gap-6">
                <div className="flex justify-between items-center relative">
                    <div className="text-2xl font-semibold">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'chats' && 'Client Messages'}
                        {activeTab === 'cases' && 'Case Management'}
                        {activeTab === 'reviews' && 'Client Reviews'}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-red-600 hover:bg-red-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-red-300 transition"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="font-semibold px-3 py-1 bg-white border rounded-full shadow-sm hover:bg-gray-100 transition"
                            >
                                {user.name} ▼
                            </button>
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-4 z-50 text-sm border">
                                    <div className="font-semibold mb-1">{user.name}</div>
                                    <div className="text-gray-600">{user.email}</div>
                                    <hr className="my-2" />
                                    <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md">View Profile</button>
                                    <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md">Edit Info</button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B0B5C]"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="text-gray-500 text-xs">Today Bookings</div>
                                        <div className="text-xl font-bold">{dashboardData.todayBookings}</div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="text-gray-500 text-xs">Total Clients</div>
                                        <div className="text-xl font-bold">{dashboardData.totalClients}</div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="text-gray-500 text-xs">Pending Reviews</div>
                                        <div className="text-xl font-bold">{dashboardData.pendingReviews}</div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="text-gray-500 text-xs">Total Earnings</div>
                                        <div className="text-xl font-bold">{formatCurrency(dashboardData.totalEarnings)}</div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 shadow">
                                    <div className="text-sm font-semibold mb-3">CASE STATUS OVERVIEW</div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-gray-500 text-xs">New Cases</div>
                                            <div className="text-xl font-bold">{dashboardData.caseStatus.newCases}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs">Ongoing Cases</div>
                                            <div className="text-xl font-bold">{dashboardData.caseStatus.ongoingCases}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs">Pending Review</div>
                                            <div className="text-xl font-bold">{dashboardData.caseStatus.pendingReview}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-xs">Resolved Cases</div>
                                            <div className="text-xl font-bold">{dashboardData.caseStatus.resolvedCases}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="font-semibold mb-2">Upcoming Appointments</div>
                                        {dashboardData.appointments.length > 0 ? (
                                            <ul className="text-sm space-y-2">
                                                {dashboardData.appointments.map((app, index) => (
                                                    <li key={index}>
                                                        <strong>{app.userId?.name || 'Client'}</strong> – {app.time}<br />
                                                        {app.notes || 'Consultation'}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No appointments for today</p>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="font-semibold mb-2">Financial Summary</div>
                                        <ResponsiveContainer width="100%" height={120}>
                                            <BarChart data={dashboardData.earningsData}>
                                                <XAxis dataKey="name" fontSize={10} />
                                                <YAxis fontSize={10} />
                                                <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                                                <Bar dataKey="earnings" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        <div className="mt-2 text-sm">
                                            <p>Monthly Average: {formatCurrency(
                                                dashboardData.earningsData.reduce((sum, item) => sum + item.earnings, 0) / 
                                                (dashboardData.earningsData.length || 1)
                                            )}</p>
                                            <p>YTD Total: {formatCurrency(dashboardData.totalEarnings)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="font-semibold mb-2">Recent Clients</div>
                                        {dashboardData.recentClients.length > 0 ? (
                                            <ul className="text-sm space-y-2">
                                                {dashboardData.recentClients.map((client, index) => (
                                                    <li key={index}>
                                                        <strong>{client.userId?.name || 'Client'}</strong><br />
                                                        Case: {client.notes || 'Consultation'}<br />
                                                        Last seen: {new Date(client.createdAt).toLocaleDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No recent clients</p>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 shadow">
                                        <div className="font-semibold mb-2">Calendar</div>
                                        <Calendar className="w-full rounded-xl border-none text-sm" />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeTab === 'chats' && (
                            <ErrorBoundary>
                                <LawyerChat user={user} />
                            </ErrorBoundary>
                        )}
                        
                        {activeTab === 'cases' && (
                            <div className="bg-white rounded-xl p-6 shadow">
                                <p className="text-center text-gray-500">Case management interface will be available soon.</p>
                            </div>
                        )}
                        
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-xl p-6 shadow">
                                <p className="text-center text-gray-500">Reviews interface will be available soon.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function LawyerChat({ user }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socket = useRef(null);
    const [error, setError] = useState(null);
    const [pendingChats, setPendingChats] = useState([]);
    const [activeChats, setActiveChats] = useState([]);
    
    useEffect(() => {
        try {
            // Get the lawyerId based on user source
            const lawyerId = user.source === 'lawyer' ? user.id : user.lawyerId;
            
            console.log("Initializing LawyerChat with ID:", lawyerId);
            
            if (!lawyerId) {
                setError("Lawyer ID not found. Please log out and log in again.");
                setLoading(false);
                return;
            }
            
            const fetchChats = async () => {
                try {
                    setLoading(true);
                    console.log(`Fetching chats for lawyer ID: ${lawyerId}`);
                    const data = await getLawyerChats(lawyerId);
                    console.log("Fetched chats:", data);
                    
                    // Separate pending from active chats
                    const pending = data.filter(chat => chat.status === 'pending');
                    const active = data.filter(chat => chat.status === 'accepted');
                    
                    setPendingChats(pending);
                    setActiveChats(active);
                    setChats(data);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching chats:', error);
                    setError("Failed to load chat conversations: " + error.message);
                } finally {
                    setLoading(false);
                }
            };
            
            // Initialize socket connection
            socket.current = initSocket();
            
            if (socket.current) {
                // Authenticate with the proper lawyerId
                authenticateSocket(lawyerId, 'lawyer');
                
                // Listen for new chat requests
                socket.current.on('chatRequest', (data) => {
                    console.log("New chat request received:", data);
                    toast.info(`New chat request from ${data.user?.name || 'a client'}`);
                    fetchChats(); // Refresh chat list
                });
            }
            
            fetchChats();
            
            // Cleanup function
            return () => {
                if (socket.current) {
                    socket.current.off('chatRequest');
                    disconnectSocket();
                }
            };
        } catch (err) {
            console.error("Error initializing chat:", err);
            setError("Failed to initialize chat: " + err.message);
            setLoading(false);
        }
    }, [user]);
    
    useEffect(() => {
        if (activeChat && socket.current) {
            try {
                const fetchChatMessages = async () => {
                    try {
                        const data = await getChatHistory(activeChat._id);
                        setChatMessages(data.messages || []);
                    } catch (error) {
                        console.error('Error fetching chat messages:', error);
                        setError("Failed to load chat messages: " + error.message);
                    }
                };
                
                fetchChatMessages();
                joinChatRoom(activeChat._id);
                
                const messageHandler = (newMessage) => {
                    if (newMessage.chatId === activeChat._id) {
                        setChatMessages(prev => [...prev, newMessage]);
                    }
                };
                
                onReceiveMessage(messageHandler);
                
                return () => {
                    if (socket.current) {
                        socket.current.off('receiveMessage', messageHandler);
                    }
                };
            } catch (err) {
                console.error("Error setting up chat room:", err);
                setError("Failed to set up chat room: " + err.message);
            }
        }
    }, [activeChat]);
    
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat || !socket.current) return;
        
        try {
            setSending(true);
            
            const lawyerId = user.source === 'lawyer' ? user.id : user.lawyerId;
            sendMessage(activeChat._id, 'lawyer', message, activeChat.user._id, lawyerId);
            
            setChatMessages(prev => [...prev, { 
                sender: 'lawyer', 
                text: message, 
                timestamp: new Date() 
            }]);
            
            setMessage('');
            setError(null);
        } catch (error) {
            console.error('Error sending message:', error);
            setError("Failed to send message: " + error.message);
        } finally {
            setSending(false);
        }
    };
    
    const handleChatRequest = async (chatId, action) => {
        try {
            console.log(`Handling chat request: ${action} for chat ${chatId}`);
            
            const response = await fetch(`/api/chat/${chatId}/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ action })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: `HTTP error: ${response.status}` }));
                throw new Error(errorData.error || `Failed to ${action} chat request`);
            }
            
            const result = await response.json();
            console.log(`Chat request ${action} result:`, result);
            
            const lawyerId = user.source === 'lawyer' ? user.id : user.lawyerId;
            const data = await getLawyerChats(lawyerId);
            
            const pending = data.filter(chat => chat.status === 'pending');
            const active = data.filter(chat => chat.status === 'accepted');
            
            setPendingChats(pending);
            setActiveChats(active);
            setChats(data);
            
            toast.success(`Chat request ${action === 'accept' ? 'accepted' : 'declined'} successfully`);
        } catch (error) {
            console.error(`Error ${action}ing chat request:`, error);
            toast.error(`Failed to ${action} chat request: ${error.message}`);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    
    if (error) {
        return (
            <div className="bg-white rounded-xl p-4 shadow">
                <div className="p-6 text-center">
                    <div className="text-red-600 mb-4">Error: {error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-[#0B0B5C] text-white px-4 py-2 rounded-md"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold">Client Conversations</h3>
                </div>
                
                {pendingChats.length > 0 && (
                    <div className="bg-yellow-50 p-2">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Pending Requests ({pendingChats.length})</h4>
                        {pendingChats.map(chat => (
                            <div key={chat._id} className="p-3 border-b border-yellow-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{chat.user?.name || "Client"}</p>
                                        <p className="text-xs text-gray-500">
                                            Request received: {new Date(chat.lastActivity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 flex space-x-2">
                                    <button 
                                        onClick={() => handleChatRequest(chat._id, 'accept')}
                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => handleChatRequest(chat._id, 'decline')}
                                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="h-[calc(100vh-280px)] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-[#0B0B5C] rounded-full"></div>
                        </div>
                    ) : activeChats.length === 0 && pendingChats.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">No active conversations yet</div>
                    ) : (
                        <div>
                            {activeChats.length > 0 && (
                                <h4 className="text-sm font-medium text-gray-600 p-2">Active Chats</h4>
                            )}
                            {activeChats.map(chat => (
                                <div 
                                    key={chat._id}
                                    onClick={() => setActiveChat(chat)}
                                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                                        activeChat && activeChat._id === chat._id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{chat.user?.name || "Client"}</p>
                                            <p className="text-xs text-gray-500">
                                                {chat.lastMessage ? 
                                                    (chat.lastMessage.text.length > 30 ? 
                                                        chat.lastMessage.text.substring(0, 30) + '...' : 
                                                        chat.lastMessage.text) : 
                                                    'No messages yet'}
                                            </p>
                                        </div>
                                        {chat.unreadCount > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-right mt-1 text-gray-400">
                                        {chat.lastActivity ? formatDate(chat.lastActivity) : ''}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow md:col-span-2 flex flex-col">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{activeChat.user?.name || "Client"}</h3>
                                <p className="text-xs text-gray-500">
                                    {activeChat.lastActivity ? `Last active: ${formatDate(activeChat.lastActivity)}` : ''}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-300px)] bg-gray-50">
                            {chatMessages.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    No messages yet. Send a message to start the conversation.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {chatMessages.map((msg, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex ${msg.sender === 'lawyer' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div 
                                                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                                    msg.sender === 'lawyer' 
                                                        ? 'bg-[#0B0B5C] text-white rounded-tr-none' 
                                                        : 'bg-gray-200 text-gray-800 rounded-tl-none'
                                                }`}
                                            >
                                                <p>{msg.text}</p>
                                                <p className="text-xs mt-1 opacity-70 text-right">
                                                    {msg.timestamp ? formatDate(msg.timestamp) : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                        
                        <div className="p-3 border-t border-gray-200">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B0B5C]"
                                    placeholder="Type your message..."
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending || !message.trim()}
                                    className="bg-[#0B0B5C] text-white px-4 py-2 rounded-r-lg disabled:opacity-50 flex items-center"
                                >
                                    <Send size={18} className="mr-1" /> Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p>Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
