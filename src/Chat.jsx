import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './utils/authContext';
import { fetchWalletBalance, bookAppointment, createChatRoom, getChatHistory } from './utils/api';
import { initSocket, sendMessage, onReceiveMessage, joinChatRoom, authenticateSocket, disconnectSocket } from './utils/socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Send, Wallet, Clock, AlertCircle } from 'lucide-react';

const ChatPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { lawyerId, name: lawyerName, image: lawyerImage, price = 500 } = location.state || {};
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [appointmentActive, setAppointmentActive] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    const messagesEndRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!lawyerId) {
            navigate('/lawyer');
            return;
        }

        const loadChatData = async () => {
            try {
                setLoading(true);
                
                // Get wallet balance
                const walletData = await fetchWalletBalance();
                setWalletBalance(walletData.balance);
                
                // Try to create/get chat room
                try {
                    const chatData = await createChatRoom(lawyerId);
                    setChatId(chatData._id);
                    
                    // Get chat history
                    const chatHistory = await getChatHistory(chatData._id);
                    setMessages(chatHistory.messages || []);
                    setAppointmentActive(chatHistory.appointmentActive);
                    
                    // Initialize socket connection
                    socket.current = initSocket();
                    authenticateSocket(user.id, user.role);
                    joinChatRoom(chatData._id);
                    
                    onReceiveMessage((newMessage) => {
                        if (newMessage.chatId === chatData._id) {
                            setMessages(prev => [...prev, newMessage]);
                        }
                    });
                } catch (error) {
                    if (error.message.includes('must have a paid appointment')) {
                        // Show payment modal if no active appointment
                        setShowPaymentModal(true);
                    } else {
                        toast.error('Failed to load chat. Please try again.');
                        console.error(error);
                    }
                }
                
            } catch (error) {
                toast.error('Error loading chat data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadChatData();

        return () => {
            disconnectSocket();
        };
    }, [user, lawyerId, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!appointmentActive) {
            toast.error('Your appointment has ended. You cannot send new messages.');
            return;
        }
        
        if (message.trim()) {
            sendMessage(chatId, 'user', message, user.id, lawyerId);
            setMessages(prev => [...prev, { sender: 'user', text: message, timestamp: new Date() }]);
            setMessage('');
        }
    };

    const handleBookAppointment = async () => {
        try {
            if (walletBalance < price) {
                toast.error(`Insufficient balance. Please add at least ₹${price - walletBalance} to your wallet.`);
                navigate('/wallet');
                return;
            }
            
            // Create today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
            
            // Book appointment
            await bookAppointment(lawyerId, today, currentTime);
            
            // Create chat room after appointment is booked
            const chatData = await createChatRoom(lawyerId);
            setChatId(chatData._id);
            
            // Initialize socket connection
            socket.current = initSocket();
            authenticateSocket(user.id, user.role);
            joinChatRoom(chatData._id);
            
            onReceiveMessage((newMessage) => {
                if (newMessage.chatId === chatData._id) {
                    setMessages(prev => [...prev, newMessage]);
                }
            });
            
            // Update wallet balance
            const walletData = await fetchWalletBalance();
            setWalletBalance(walletData.balance);
            
            setAppointmentActive(true);
            setShowPaymentModal(false);
            
            // Add initial system message
            setMessages([{ 
                sender: 'system', 
                text: `Your session with ${lawyerName} has started. You can now chat with the lawyer.` 
            }]);
            
            toast.success('Appointment booked successfully!');
            
        } catch (error) {
            toast.error('Failed to book appointment. Please try again.');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B0B5C]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black pt-6 pb-20">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Chat header */}
                    <div className="bg-[#0B0B5C] text-white p-4 flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                            {lawyerImage ? (
                                <img src={lawyerImage} alt={lawyerName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600">
                                    {lawyerName?.charAt(0) || 'L'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="font-semibold">Adv. {lawyerName}</h2>
                            <div className="text-xs flex items-center">
                                {appointmentActive ? (
                                    <>
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                        <span>Online • Session Active</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock size={12} className="mr-1" />
                                        <span>Session Ended</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="ml-auto flex items-center">
                            <div className="bg-blue-700 px-3 py-1 rounded-full text-sm">
                                <Wallet size={14} className="inline mr-1" />
                                ₹{walletBalance}
                            </div>
                        </div>
                    </div>
                    
                    {/* Chat messages */}
                    <div className="h-[calc(100vh-300px)] overflow-y-auto p-4 bg-gray-50" style={{ minHeight: '400px' }}>
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <AlertCircle size={40} className="mb-2" />
                                <p>No messages yet</p>
                                <p className="text-sm">Send a message to start the conversation</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`mb-4 ${
                                    msg.sender === 'user' ? 'text-right' : 
                                    msg.sender === 'system' ? 'text-center' : 'text-left'
                                }`}>
                                    {msg.sender === 'system' ? (
                                        <div className="inline-block p-3 bg-yellow-100 text-yellow-800 rounded-lg max-w-[80%]">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                                            msg.sender === 'user' 
                                                ? 'bg-[#0B0B5C] text-white' 
                                                : 'bg-gray-200 text-black'
                                        }`}>
                                            {msg.text}
                                            <div className="text-xs mt-1 opacity-70 text-right">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Chat input */}
                    <div className="p-4 border-t">
                        {appointmentActive ? (
                            <div className="flex">
                                <input
                                    className="flex-1 border px-4 py-2 rounded-l-lg focus:outline-none"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-[#0B0B5C] text-white px-4 py-2 rounded-r-lg"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center">
                                Your session has ended. You can view past messages but cannot send new ones.
                                <button 
                                    onClick={() => setShowPaymentModal(true)}
                                    className="ml-2 underline text-blue-600 hover:text-blue-800"
                                >
                                    Book new session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-[#0B0B5C]">Book Consultation</h2>
                        
                        <div className="mb-6">
                            <p className="mb-4">
                                To chat with Adv. {lawyerName}, you need to book a consultation session.
                            </p>
                            
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <div className="flex justify-between mb-2">
                                    <span>Consultation Fee:</span>
                                    <span className="font-semibold">₹{price}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Wallet Balance:</span>
                                    <span className={walletBalance < price ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                                        ₹{walletBalance}
                                    </span>
                                </div>
                                {walletBalance < price && (
                                    <div className="text-red-600 text-sm mt-2">
                                        Insufficient balance. Please add funds to your wallet.
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/wallet')}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition duration-200"
                            >
                                Add Money
                            </button>
                            <button
                                onClick={handleBookAppointment}
                                disabled={walletBalance < price}
                                className={`flex-1 py-2 rounded-lg transition duration-200 ${
                                    walletBalance < price 
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                        : "bg-[#0B0B5C] hover:bg-[#090947] text-white"
                                }`}
                            >
                                Pay & Chat Now
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/lawyer')}
                            className="w-full text-gray-500 mt-4 text-sm hover:underline"
                        >
                            Cancel and go back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
