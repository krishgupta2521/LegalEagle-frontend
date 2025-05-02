import React, { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const data = [
    { name: "Jan", earnings: 3200 },
    { name: "Feb", earnings: 4200 },
    { name: "Mar", earnings: 3900 },
    { name: "Apr", earnings: 4600 },
    { name: "May", earnings: 5100 },
    { name: "Jun", earnings: 4700 },
];

export default function LawyerDashboard() {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                        <button className="flex items-center gap-1 text-red-600 hover:bg-red-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-red-300 transition">
                            <LogOut size={16} />
                            Logout
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="font-semibold px-3 py-1 bg-white border rounded-full shadow-sm hover:bg-gray-100 transition"
                            >
                                [Profile ▼]
                            </button>
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-4 z-50 text-sm border">
                                    <div className="font-semibold mb-1">Adv. Priya Sharma</div>
                                    <div className="text-gray-600">priya.sharma@legaleagle.in</div>
                                    <div className="text-gray-600 mb-2">Specialization: Civil, Family</div>
                                    <hr className="my-2" />
                                    <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md">View Profile</button>
                                    <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md">Edit Info</button>
                                    <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md text-red-600">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Today Bookings", "Total Clients", "Pending Reviews", "Total Earnings"].map((label, index) => {
                        const values = [5, 42, 7, "$4,850"];
                        return (
                            <div key={label} className="bg-white rounded-2xl p-4 shadow">
                                <div className="text-gray-500 text-xs">{label}</div>
                                <div className="text-xl font-bold">{values[index]}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-2xl p-4 shadow">
                    <div className="text-sm font-semibold mb-3">CASE STATUS OVERVIEW</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["New Cases", "Ongoing Cases", "Pending Review", "Resolved Cases"].map((label, index) => {
                            const values = [8, 16, 12, 23];
                            return (
                                <div key={label}>
                                    <div className="text-gray-500 text-xs">{label}</div>
                                    <div className="text-xl font-bold">{values[index]}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <div className="font-semibold mb-2">Upcoming Appointments</div>
                        <ul className="text-sm space-y-2">
                            <li><strong>John Doe</strong> – 10:00 AM<br />Contract Review</li>
                            <li><strong>Jane Smith</strong> – 2:30 PM<br />Divorce Consultation</li>
                            <li><strong>Robert Jones</strong> – Tomorrow<br />Will Preparation</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <div className="font-semibold mb-2">Financial Summary</div>
                        <div className="text-sm mb-2">[LINE CHART: 6-MONTH VIEW]</div>
                        <ResponsiveContainer width="100%" height={120}>
                            <BarChart data={data}>
                                <XAxis dataKey="name" fontSize={10} />
                                <YAxis fontSize={10} />
                                <Tooltip />
                                <Bar dataKey="earnings" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-2 text-sm">
                            <p>Monthly Average: $4,250</p>
                            <p>YTD Total: $32,500</p>
                            <p>Growth: +15% from last year</p>
                            <p>Top Service: Family Law ($12,800 – 39%)</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <div className="font-semibold mb-2">Recent Clients</div>
                        <ul className="text-sm space-y-2">
                            <li><strong>Thomas Wilson</strong><br />Case: Property Dispute<br />Last seen: Yesterday</li>
                            <li><strong>Amanda Lewis</strong><br />Case: Business Contract<br />Last seen: 3 days ago</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <div className="font-semibold mb-2">Calendar</div>
                        <Calendar className="w-full rounded-xl border-none text-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
