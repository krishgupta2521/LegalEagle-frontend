import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", earnings: 3200 },
    { name: "Feb", earnings: 4200 },
    { name: "Mar", earnings: 3900 },
    { name: "Apr", earnings: 4600 },
    { name: "May", earnings: 5100 },
    { name: "Jun", earnings: 4700 },
];

export default function LawyerDashboard() {
    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-6 gap-6 bg-gray-50 min-h-screen text-sm">
            <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow flex flex-col space-y-4">
                <div className="font-bold text-lg">LEGAL EAGLE</div>
                <nav className="space-y-2">
                    {[
                        "Dashboard",
                        "Appointments",
                        "Clients",
                        "Cases",
                        "Calendar",
                        "Finances",
                        "Availability",
                        "Documents",
                        "Reviews",
                        "Settings",
                    ].map((item) => (
                        <div className="hover:text-blue-600 cursor-pointer">{item}</div>
                    ))}
                </nav>
            </div>

            <div className="lg:col-span-5 grid gap-6">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-semibold">Dashboard Overview</div>
                    <div className="space-x-4">
                        <input
                            placeholder="Search..."
                            className="border rounded px-3 py-1"
                        />
                        <button className="font-semibold">[Profile ▼]</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        ["Today Bookings", 5],
                        ["Total Clients", 42],
                        ["Pending Reviews", 7],
                        ["Total Earnings", "$4,850"],
                    ].map(([label, value]) => (
                        <div className="bg-white rounded-2xl p-4 shadow">
                            <div className="text-gray-500 text-xs">{label}</div>
                            <div className="text-xl font-bold">{value}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-4 shadow">
                    <div className="text-sm font-semibold mb-3">CASE STATUS OVERVIEW</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            ["New Cases", 8],
                            ["Ongoing Cases", 16],
                            ["Pending Review", 12],
                            ["Resolved Cases", 23],
                        ].map(([label, value]) => (
                            <div>
                                <div className="text-gray-500 text-xs">{label}</div>
                                <div className="text-xl font-bold">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <div className="font-semibold mb-2">Upcoming Appointments</div>
                        <ul className="text-sm space-y-2">
                            <li>
                                <strong>John Doe</strong> – 10:00 AM<br />Contract Review
                            </li>
                            <li>
                                <strong>Jane Smith</strong> – 2:30 PM<br />Divorce Consultation
                            </li>
                            <li>
                                <strong>Robert Jones</strong> – Tomorrow<br />Will Preparation
                            </li>
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
                            <li>
                                <strong>Thomas Wilson</strong><br />
                                Case: Property Dispute<br />
                                Last seen: Yesterday
                            </li>
                            <li>
                                <strong>Amanda Lewis</strong><br />
                                Case: Business Contract<br />
                                Last seen: 3 days ago
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <div className="font-semibold mb-2">Availability Today</div>
                        <table className="w-full text-xs text-center">
                            <thead>
                                <tr>
                                    {["9-10", "10-11", "11-12", "12-1"].map((slot) => (
                                        <th className="px-2 py-1 border">{slot}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {["✔️", "❌", "✔️", "❌"].map((status) => (
                                        <td className="px-2 py-1 border">{status}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <table className="w-full text-xs text-center mt-2">
                            <thead>
                                <tr>
                                    {["1-2", "2-3", "3-4", "4-5"].map((slot) => (
                                        <th className="px-2 py-1 border">{slot}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {["❌", "✔️", "✔️", "✔️"].map((status) => (
                                        <td className="px-2 py-1 border">{status}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}