import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { register } from './utils/api';
import { useAuth } from './utils/authContext';

const ClientRegister = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ 
        name: "",
        email: "", 
        username: "", 
        password: "", 
        confirmpassword: "" 
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showPassword = () => {
        if (ref.current.src.includes("/eyecross.png")) {
            ref.current.src = "/eye.png";
            passwordRef.current.type = "password";
        } else {
            passwordRef.current.type = "text";
            ref.current.src = "/eyecross.png";
        }
    };

    const handleSubmit = async () => {
        try {
            setError("");
            setLoading(true);
            
            if (!form.email || !form.username || !form.password || !form.confirmpassword || !form.name) {
                setError("Please fill all required fields");
                return;
            }
            
            if (!form.email.includes("@")) {
                setError("Please enter a valid email address");
                return;
            }
            
            if (form.password !== form.confirmpassword) {
                setError("Passwords do not match");
                return;
            }

            const userData = {
                email: form.email,
                password: form.password,
                name: form.name || form.username, // Use name if provided, otherwise username
                role: 'user'
            };

            const response = await register(userData);
            login(response);
            navigate('/lawyer');
            
        } catch (error) {
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-1/2 flex justify-center items-center p-10">
                <div className="w-96 text-center">
                    <h2 className="text-6xl font-bold mb-14 tracking-tight subpixel-antialiased">REGISTER</h2>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <input
                        value={form.name}
                        onChange={handleChange}
                        placeholder='Full Name'
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        type="text"
                        name="name"
                    />
                    
                    <input
                        value={form.email}
                        onChange={handleChange}
                        placeholder='Email Address'
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        type="email"
                        name="email"
                    />
                    
                    <input
                        value={form.username}
                        onChange={handleChange}
                        placeholder='Username'
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        type="text"
                        name="username"
                    />

                    <div className="relative w-full">
                        <input
                            ref={passwordRef}
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Password'
                            className='w-full p-3 pr-10 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                            type="password"
                            name="password"
                        />
                        <span className='absolute right-3 top-3 cursor-pointer' onClick={showPassword}>
                            <img ref={ref} width={28} src="/eye.png" alt="eye toggle" />
                        </span>
                    </div>

                    <input
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        type="password"
                        value={form.confirmpassword}
                        onChange={handleChange}
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full mt-4 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-blue-800 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registering...' : 'Continue'}
                    </button>

                    <div className="mt-6 flex space-x-6 justify-center text-[1.2rem]">
                        <p className="text-blue-700 cursor-pointer hover:underline">
                            <Link to="/login">Log In</Link>
                        </p>
                        <p className="text-green-700 cursor-pointer hover:underline">
                            <Link to="/lawyerregister">Register as a Lawyer</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div
                className="w-1/2 h-screen bg-cover bg-center border-2 border-solid"
                style={{ backgroundImage: "url('/signup.jpg')" }}
            ></div>
        </div>
    );
};

export default ClientRegister;
