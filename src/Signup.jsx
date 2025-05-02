import React, { useState } from 'react';

const SimpleSignUp = () => {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        const { username, password } = form;

        if (!username || !password) {
            alert("Please fill in both fields.");
            return;
        }

        alert("User Registered Successfully!");

        setForm({
            username: "",
            password: ""
        });
    };

    return (
        <div className="min-h-screen flex items-center object-cover justify-center bg-cover bg-center" style={{ backgroundImage: "url('/back.webp')" }}>
            <div className="w-full max-w-sm p-8 bg-white bg-opacity-80 shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Welcome Back!</h2>
                <form className="space-y-6">
                    <div>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SimpleSignUp;
