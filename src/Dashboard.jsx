import React, { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./utils/authContext";

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
            if (!user || !user.id) return;
            
            try {
                setLoading(true);
                
                const response = await fetch(`/api/lawyer/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch lawyer profile');
                }
                
                const lawyerProfile = await response.json();
                const lawyerId = lawyerProfile._id;
                
                const appointmentsResponse = await fetch(`/api/appointments/lawyer/${lawyerId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                // Fetch chat data
                const chatsResponse = await fetch(`/api/chat/lawyer/${lawyerId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (!appointmentsResponse.ok || !chatsResponse.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                
                const appointments = await appointmentsResponse.json();
                const chats = await chatsResponse.json();
                
                // Process the data
                const today = new Date().toISOString().split('T')[0];
                const todayAppointments = appointments.filter(app => app.date === today);
                
                // Get unique clients
                const uniqueClientIds = [...new Set(appointments.map(app => app.userId?._id))];
                
                // Calculate earnings
                const totalEarnings = appointments
                    .filter(app => app.isPaid && app.status !== 'cancelled')
                    .reduce((sum, app) => sum + (app.amount || 0), 0);
                
                // Get recent clients
                const recentClients = appointments
                    .filter((app, index, self) => 
                        index === self.findIndex(a => a.userId?._id === app.userId?._id)
                    )
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                
                // Generate monthly earnings data
                const earningsData = generateMonthlyEarningsData(appointments);
                
                setDashboardData({
                    todayBookings: todayAppointments.length,
                    totalClients: uniqueClientIds.length,
                    pendingReviews: 0, // This would come from a reviews endpoint
                    totalEarnings,
                    caseStatus: {
                        newCases: appointments.filter(app => app.status === 'pending').length,
                        ongoingCases: appointments.filter(app => app.status === 'confirmed').length,
                        pendingReview: 0, // This would come from a reviews endpoint
                        resolvedCases: appointments.filter(app => app.status === 'completed').length
                    },
                    appointments: todayAppointments.slice(0, 3),
                    recentClients,
                    earningsData
                });
                
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [user]);
    
    const generateMonthlyEarningsData = (appointments) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        
        // Create array for the last 6 months
        const earningsData = [];
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            earningsData.push({
                name: months[monthIndex],
                earnings: 0
            });
        }
        
        // Fill in the earnings data
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
                    <Link to="/dashboard"><div className="hover:text-blue-600 cursor-pointer">Dashboard</div></Link>
                    <Link to="/cases"><div className="hover:text-blue-600 cursor-pointer">Cases</div></Link>
                    <Link to="/reviews"><div className="hover:text-blue-600 cursor-pointer">Reviews</div></Link>
                </nav>
            </div>

            <div className="lg:col-span-5 grid gap-6">
                <div className="flex justify-between items-center relative">
                    <div className="text-2xl font-semibold">Dashboard Overview</div>
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
            </div>
        </div>
    );
}
